import './App.css';
import Header from './component/layout/Header/Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WebFont from 'webfontloader';
import React, { useState, useEffect } from 'react';
import Footer from './component/layout/Footer/Footer';
import Home from './component/Home/Home.jsx'
import ProductDetails from './component/Product/ProductDetails.jsx'
import Products from './component/Product/Products.jsx'
import Search from './component/Product/Search.jsx';
import LoginSignUp from './component/User/LoginSignUp.jsx';
import store from "./store";
import { loadUser } from "./actions/userAction";
import UserOptions from "./component/layout/Header/UserOptions.jsx";
import { useSelector } from "react-redux";
import Profile from "./component/User/Profile.jsx";
import ProtectedRoute from "./component/Route/ProtectedRoute.jsx";
import UpdateProfile from './component/User/UpdateProfile.jsx';
import UpdatePassword from './component/User/UpdatePassword.jsx';
import ForgotPassword from './component/User/ForgotPassword.jsx';
import ResetPassword from './component/User/ResetPassword.jsx';
import Cart from './component/Cart/Cart.jsx';
import Shipping from './component/Cart/Shipping.jsx';
import ConfirmOrder from './component/Cart/ConfirmOrder.jsx';
import axios from "axios";
import Payment from "./component/Cart/Payment.jsx";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./component/Cart/OrderSuccess.jsx";
import MyOrders from './component/Order/MyOrders.jsx';
import OrderDetails from './component/Order/OrderDetails.jsx';
import Dashboard from './component/Admin/Dashboard.jsx';
import ProductList from './component/Admin/ProductList.jsx';
import NewProduct from './component/Admin/NewProduct.jsx';
import UpdateProduct from './component/Admin/UpdateProduct.jsx';
import OrderList from './component/Admin/OrderList.jsx';
import ProcessOrder from './component/Admin/ProcessOrder.jsx';
import UsersList from './component/Admin/UserList.jsx';
import UpdateUser from './component/Admin/UpdateUser.jsx';
import ProductReviews from './component/Admin/ProductReviews.jsx';
import Contact from './component/layout/Contact/Contact.jsx';
import About from './component/layout/About/About.jsx';
import NotFound from './component/layout/Not Found/NotFound.jsx'

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("");
  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Roboto', 'Droid Sans', 'Chilanka']
      }
    });
    store.dispatch(loadUser());

    getStripeApiKey();
  }, []);

  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}

      <Routes>
        <Route exact path='/' Component={Home} />
        <Route exact path='/product/:id' Component={ProductDetails} />
        <Route exact path='/products' Component={Products} />
        <Route path='/products/:keyword' Component={Products} />
        <Route exact path='/search' Component={Search} />
        <Route exact path='/login' Component={LoginSignUp} />

        <Route exact path='/account' element={<ProtectedRoute element={Profile} />} />
        <Route exact path='/me/update' element={<ProtectedRoute element={UpdateProfile} />} />
        <Route exact path='/password/update' element={<ProtectedRoute element={UpdatePassword} />} />

        <Route exact path='/password/forgot' Component={ForgotPassword} />
        <Route exact path='/password/reset/:token' Component={ResetPassword} />
        <Route exact path="/cart" Component={Cart} />

        <Route exact path='/shipping' element={<ProtectedRoute element={Shipping} />} />
        <Route exact path='/order/confirm' element={<ProtectedRoute element={ConfirmOrder} />} />

        {stripeApiKey && (
          <Route exact path='/process/payment' element={
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute element={Payment} />
            </Elements>
          } />
        )}

        <Route exact path='/success' element={<ProtectedRoute element={OrderSuccess} />} />
        <Route exact path='/orders' element={<ProtectedRoute element={MyOrders} />} />
        <Route exact path='/order/:id' element={<ProtectedRoute element={OrderDetails} />} />

        <Route exact path='/admin/dashboard' element={<ProtectedRoute isAdmin={true} element={Dashboard} />} />

        <Route exact path='/admin/products' element={<ProtectedRoute isAdmin={true} element={ProductList} />} />
        <Route exact path='/admin/product' element={<ProtectedRoute isAdmin={true} element={NewProduct} />} />
        <Route exact path='/admin/product/:id' element={<ProtectedRoute isAdmin={true} element={UpdateProduct} />} />

        <Route exact path='/admin/orders' element={<ProtectedRoute isAdmin={true} element={OrderList} />} />
        <Route exact path='/admin/order/:id' element={<ProtectedRoute isAdmin={true} element={ProcessOrder} />} />

        <Route exact path='/admin/users' element={<ProtectedRoute isAdmin={true} element={UsersList} />} />
        <Route exact path='/admin/user/:id' element={<ProtectedRoute isAdmin={true} element={UpdateUser} />} />

        <Route exact path='/admin/reviews' element={<ProtectedRoute isAdmin={true} element={ProductReviews} />} />

        <Route exact path="/contact" Component={Contact} />
        <Route exact path="/about" Component={About} />
        <Route path='*' Component={NotFound} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
