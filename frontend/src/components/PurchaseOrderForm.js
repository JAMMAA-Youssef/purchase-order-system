import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PurchaseOrderForm({ selectedSupplier, setSelectedSupplier }) { 
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/suppliers');
        setSuppliers(res.data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchSuppliers();
    fetchProducts();
  }, []);

  const handleAddItem = () => {
    setOrderItems([...orderItems, { product: '', quantity: 1 }]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...orderItems];
    updatedItems[index][field] = value;
    setOrderItems(updatedItems);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const purchaseOrderData = {
        supplier: selectedSupplier,
        items: orderItems,
      };

      const res = await axios.post('http://localhost:5000/api/purchase-orders', purchaseOrderData);
      console.log('Purchase Order created:', res.data);
    } catch (error) {
      console.error('Error creating purchase order:', error);
    }
  };

  return (
    <div>
      <h2><i className="fas fa-store"></i> Create New Purchase Order</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="supplier">
            Supplier
          </label>
          <select
            id="supplier"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedSupplier} 
            onChange={(e) => setSelectedSupplier(e.target.value)} // Update selectedSupplier
          >
            <option value="">Select Supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier._id} value={supplier._id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        {orderItems.map((item, index) => (
          <div key={index} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`product-${index}`}>
              Product
            </label>
            <select
              id={`product-${index}`}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={item.product}
              onChange={(e) => handleItemChange(index, 'product', e.target.value)}
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>

            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`quantity-${index}`}>
              Quantity
            </label>
            <input
              type="number"
              id={`quantity-${index}`}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value, 10))}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddItem}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Item
        </button>

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Purchase Order
        </button>
      </form>
    </div>
  );
}

export default PurchaseOrderForm;
