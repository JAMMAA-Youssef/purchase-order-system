const mongoose = require('mongoose');
const { PurchaseOrder } = require('./models');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const exportData = async () => {
  try {
    // Connect to MongoDB with increased timeout (if needed)
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Adjust if necessary
    });
    console.log('Connected to MongoDB');

    const purchaseOrders = await PurchaseOrder.find()
      .populate('supplier')
      .populate('items.product');

    // Format the data for CSV with proper "items" column
    const csvData = purchaseOrders.map(order => {
      const orderItems = order.items.map(item => `${item.product.name} (${item.quantity})`).join(', ');
      const totalPrice = order.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      // Wrap orderItems in double quotes to make it a single string field
      return `${order._id},${order.supplier.name},"${orderItems}",${totalPrice},${order.orderDate},${order.status}`; 
    }).join('\n');

    fs.writeFileSync('./data/purchase_orders.csv', csvData);
    console.log('Purchase order data exported to data/purchase_orders.csv');

    await mongoose.connection.close(); // Close the connection
  } catch (error) {
    console.error('Error exporting data:', error);
    await mongoose.connection.close(); // Close connection on error
  }
};

exportData();