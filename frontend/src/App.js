import './App.css';
import Header from './component/layout/Header/Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WebFont from 'webfontloader';
import React from 'react';
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

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  React.useEffect(() => {
    WebFont.load({
      google: {
        families: ['Roboto', 'Droid Sans', 'Chilanka']
      }
    });
    store.dispatch(loadUser());
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
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
