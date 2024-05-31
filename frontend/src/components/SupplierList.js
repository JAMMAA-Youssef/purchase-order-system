import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../SupplierList.css';

function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/suppliers');
        setSuppliers(res.data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };
    fetchSuppliers();
  }, []);

  const handleDelete = async (supplierId) => {
    try {
      await axios.delete(`http://localhost:5000/api/suppliers/${supplierId}`);
      setSuppliers(suppliers.filter(supplier => supplier._id !== supplierId));
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Suppliers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {suppliers.map(supplier => (
          <div key={supplier._id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 relative hover:shadow-lg transition-shadow duration-300">
            {/* Add image display if supplier.image exists */}
            {supplier.image && (
              <div className='supplier-image-container'>
                <img 
                  src={`http://localhost:5000/${supplier.image}`} 
                  alt={supplier.name} 
                  className="object-cover mb-4 " 
                />
              </div>
            )}
            <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
            <p className="text-gray-700">{supplier.email}</p>
            <div className="flex justify-end items-center mt-4">
              <button
                onClick={() => handleDelete(supplier._id)}
                className="text-red-500 hover:text-red-700"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SupplierList;
