import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../ProductList.css';

function ProductList({ addToCart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`);
      setProducts(products.filter(product => product._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(product => (
          <div key={product._id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 relative hover:shadow-lg transition-shadow duration-300">
            {product.image && (
              <div className='product-image-container'>
                <img 
                  src={`http://localhost:5000/${product.image}`} 
                  alt={product.name} 
                  className="object-cover mb-4 " 
                />
              </div>
            )}
            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
            <p className="text-gray-700">{product.price} DH <span className="text-sm">(Stock: {product.stock})</span></p>
            <p className="text-gray-700">Supplier: {product.supplier ? product.supplier.name : 'Unknown Supplier'}</p>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => handleDelete(product._id)}
                className="text-red-500 hover:text-red-700"
              >
                <i className="fas fa-trash"></i>
              </button>
              <button
                onClick={() => addToCart(product)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-blue-700"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
