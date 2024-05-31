import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/NavBar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import SupplierList from './components/SupplierList';
import PurchaseOrderList from './components/PurchaseOrderList';
import AddProduct from './components/AddProduct'; // Import AddProduct component
import AddSupplier from './components/AddSupplier'; // Import AddProduct component
import axios from 'axios';
import Dashboard from './components/Dashboard';

function App() {
  const [cart, setCart] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [isCartVisible, setIsCartVisible] = useState(false);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setProductQuantities({
      ...productQuantities,
      [product._id]: 1,
    });
  };

  const handleRemoveFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleQuantityChange = (productId, quantity) => {
    setProductQuantities({
      ...productQuantities,
      [productId]: quantity,
    });
  };

  const handleProceedToPurchase = async () => {
    const purchaseOrderData = {
      supplier: cart[0]?.supplier?._id,
      items: cart.map((product) => ({
        product: product._id,
        quantity: productQuantities[product._id],
      })),
    };

    try {
      const res = await axios.post('http://localhost:5000/api/purchase-orders', purchaseOrderData);
      console.log('Purchase Order created:', res.data);
      setCart([]);
      setProductQuantities({});
    } catch (error) {
      console.error('Error creating purchase order:', error);
    }
  };

  const toggleCart = () => {
    setIsCartVisible(!isCartVisible);
  };

  return (
    <Router>
      <Navbar cart={cart} handlePurchase={toggleCart} />
      <Switch>
        <Route path="/suppliers">
          <SupplierList />
        </Route>
        <Route path="/products">
          <ProductList addToCart={addToCart} />
        </Route>
        <Route path="/purchase-orders">
          <PurchaseOrderList />
        </Route>
        <Route path="/add-product">
          <AddProduct />
        </Route>
        <Route path="/add-supplier">
          <AddSupplier />
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/">
          <ProductList addToCart={addToCart} />
        </Route>
      </Switch>
      {isCartVisible && (
        <Cart
          cart={cart}
          toggleCart={toggleCart}
          handleRemoveFromCart={handleRemoveFromCart}
          handleProceedToPurchase={handleProceedToPurchase}
          productQuantities={productQuantities}
          handleQuantityChange={handleQuantityChange}
        />
      )}
    </Router>
  );
}

export default App;
