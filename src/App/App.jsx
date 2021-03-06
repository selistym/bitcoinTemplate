import React, { useState, useEffect } from 'react';
// routing
import { BrowserRouter as Router, Route } from 'react-router-dom';
// components
import { HomePage } from '../HomePage';
import { Comparison } from '../Comparison';
import { Weight } from '../Weight';
import { Subscriptions } from '../Subscriptions';
import { Exchange } from '../Exchange';
import { Login } from '../LoginPage';
import { PrivateRoute } from './PrivateRoute';
import { Compare2 } from '../Compare2';

export const App = () => {
  // returning application
  return (
    <Router>
      <div>
        <PrivateRoute p="/" c={HomePage} />
        <PrivateRoute p="/comp" c={Comparison} />
        <PrivateRoute p="/weight" c={Weight} />
        <PrivateRoute p="/subscriptions" c={Subscriptions} />
        <PrivateRoute p="/exchange" c={Exchange} />
        <PrivateRoute p="/compare2" c={Compare2} />
        <Route path="/login" component={Login} />
      </div>
    </Router>
  );
};