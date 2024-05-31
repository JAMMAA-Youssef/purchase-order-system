import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ cart, handlePurchase }) { 
  const location = useLocation();
  const proceedToPurchase = () => {
    handlePurchase();
  };

  const getLinkClass = (path) => {
    return location.pathname === path ? 'text-blue-500 mr-4' : 'text-white mr-4 hover:text-blue-400';
  };

  return (
    <nav className="flex justify-between items-center bg-gray-900 text-white p-4 shadow-md">
      <h1 className="text-2xl font-bold">
        <span className='text-blue-500'>B</span>ig
        <span className='text-blue-500'>D</span>ata 
        <span className='text-green-300'>&</span> 
        <span className='text-blue-500'>N</span>o
        <span className='text-blue-500'>SQL</span>
      </h1>
      <div>
        <Link to="/suppliers" className={getLinkClass('/suppliers')}>Suppliers</Link>
        <Link to="/products" className={getLinkClass('/products')}>Products</Link>
        <Link to="/purchase-orders" className={getLinkClass('/purchase-orders')}>Purchase Orders</Link>
        <Link to="/add-product" className={getLinkClass('/add-product')}>Add Product</Link>
        <Link to="/add-supplier" className={getLinkClass('/add-supplier')}>Add Supplier</Link>
        <Link to="/dashboard" className={getLinkClass('/dashboard')}>Dashboard</Link>
      </div>
      <div className="relative">
        <FaShoppingCart className="text-2xl cursor-pointer hover:text-blue-400" onClick={proceedToPurchase} /> 
        {cart.length > 0 && (
          <div className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {cart.length}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
