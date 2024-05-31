import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PurchaseOrderList() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/purchase-orders');
        console.log("Fetched purchase orders:", res.data);
        setPurchaseOrders(res.data);
      } catch (error) {
        console.error('Error fetching purchase orders:', error);
      }
    };
    fetchPurchaseOrders();
  }, []);

  const getRandomColor = () => {
    const colors = [
      'from-blue-100 to-blue-200',
      'from-green-100 to-green-200',
      'from-yellow-100 to-yellow-200',
      'from-purple-100 to-purple-200',
      'from-pink-100 to-pink-200'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (!purchaseOrders.length) {
    return <div>Loading purchase orders...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800"><i className="fas fa-store"></i> Purchase Orders</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {purchaseOrders.map((order) => (
          <div key={order._id} className={`bg-gradient-to-br ${getRandomColor()} rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105`}>
            <div className="p-4">
              <p className="text-lg font-bold mb-2">Order ID: {order._id}</p>
              <p className="text-sm font-medium mb-2">Supplier: {order.supplier?.name ?? "No supplier"}</p>
              <div>
                <p className="text-sm font-medium mb-1">Items:</p>
                <ul className="list-disc list-inside ml-4">
                  {order.items.map((item) => (
                    item.product ? (
                      <li key={item.product._id} className="text-gray-700">{item.product.name} x {item.quantity}</li>
                    ) : (
                      <li key={item._id} className="text-gray-700">Product details not available</li>
                    )
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PurchaseOrderList;
