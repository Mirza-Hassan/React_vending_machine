// AppRouter.js
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Product from './components/Product';
import Vendor from './components/Vendor';
import User from './components/User';

const AppRouter = () => {
  return (
    <Router>
        <Route exact path="/" component={Register} />
        <Route path="/login" component={Login} />  
        <Route path="/user" component={User} />  
        <Route path="/product" component={Product} />
        <Route path="/Vendor" component={Vendor} />
    </Router>    
  );
};

export default AppRouter;
