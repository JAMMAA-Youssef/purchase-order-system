import React from 'react';
import { FaTimes } from 'react-icons/fa';

function Cart({ cart, toggleCart, handleRemoveFromCart, handleProceedToPurchase, productQuantities, handleQuantityChange }) {
  return (
    <div className="fixed top-0 right-0 bg-white shadow-lg rounded-lg p-2 mt-1 z-10 overflow-y-auto h-full flex flex-col">
      <div className="w-200 bg-gray-200 p-4 flex justify-between items-center">
        <FaTimes className="text-2xl cursor-pointer" onClick={toggleCart} /> {/* Close Icon */}
      </div>
      <div className="w-200 bg-gray-200 p-4">
        {cart.length === 0 ? (
          <p className="text-gray-600 text-center">Your cart is empty</p>
        ) : (
          <>
            {cart.map((product, index) => (
              <div key={index} className="flex justify-between items-center mb-2 p-2 border-b">
                <span className="flex flex-col">
                  <span>{product.name}</span>
                  <span className="text-gray-600">Price: {product.price}  DH</span>
                  <span className="text-gray-600">Supplier: {product.supplier ? product.supplier.name : 'Unknown Supplier'}</span>
                </span>
                <div>
                  <input
                    type="number"
                    min="1"
                    value={productQuantities[product._id]}
                    onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value, 10))}
                    className="w-16 text-center"
                  />
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                    onClick={() => handleRemoveFromCart(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              className="bg-blue-500 text-white px-3 py-2 rounded w-full mt-4"
              onClick={handleProceedToPurchase}
            >
              Proceed to Purchase
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
