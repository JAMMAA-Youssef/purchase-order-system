from pyspark.sql import SparkSession
from pyspark.sql.functions import explode, col, sum as spark_sum, split, regexp_extract
from pyspark.sql.types import StructType, StructField, StringType, DoubleType
import os
import json

# Initialize Spark session
spark = SparkSession.builder \
    .appName("PurchaseOrderAnalysis") \
    .getOrCreate()

# Define schema
schema = StructType([
    StructField("order_id", StringType(), True),
    StructField("supplier_name", StringType(), True),
    StructField("items", StringType(), True),
    StructField("total_price", DoubleType(), True),
    StructField("order_date", StringType(), True),
    StructField("status", StringType(), True)
])

# Load purchase orders CSV file with specified schema
purchase_orders = spark.read.csv("C:/Users/JAMMAA Youssef/Desktop/purchase-order-system/backend/data/purchase_orders.csv", header=False, schema=schema)

# Group by supplier name and calculate total spending
total_spending = purchase_orders.groupBy("supplier_name").agg(
    spark_sum("total_price").alias("total_spending")
)
total_spending.show()

# Split the items string into an array of strings
purchase_orders = purchase_orders.withColumn("items", split(col("items"), ","))

# Explode the items array into individual rows
purchase_orders = purchase_orders.withColumn("item", explode(col("items")))

# Extract product name and quantity from each item
purchase_orders = purchase_orders.withColumn("product_name", regexp_extract(col("item"), "(.+) \\((\\d+)\\)", 1)).withColumn("quantity", regexp_extract(col("item"), "(.+) \\((\\d+)\\)", 2).cast("int"))

# Group by product name and calculate total quantity ordered
product_quantities = purchase_orders.groupBy("product_name").agg(
    spark_sum("quantity").alias("total_quantity")
)
product_quantities.show()

# Paths
db_path = "C:/Users/JAMMAA Youssef/Desktop/purchase-order-system/frontend/db.json"

# Load existing data from db.json
if os.path.exists(db_path):
    with open(db_path, 'r') as db_file:
        db_data = json.load(db_file)
else:
    db_data = {"supplier_spending": [], "product_quantities": []}

# Collect the results as dictionaries
supplier_spending_data = [row.asDict() for row in total_spending.collect()]
product_quantities_data = [row.asDict() for row in product_quantities.collect()]

# Update db_data with new data
db_data["supplier_spending"] = supplier_spending_data
db_data["product_quantities"] = product_quantities_data

# Save updated data back to db.json
with open(db_path, 'w') as db_file:
    json.dump(db_data, db_file, indent=2)

# Stop the Spark session
spark.stop()
