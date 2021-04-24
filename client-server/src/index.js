import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './index.css';
import AuthRoute from './components/utils/AuthRoute'
import Login from './components/Login'
import Lineitems from './components/Lineitems'
import Campaigns from './components/Campaigns'
import Invoice from './components/Invoice'
import UserHistory from './components/UserHistory'
import {store} from './store';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" component={ Login } />

        <AuthRoute path="/lineitems" component={ Lineitems } />
        <AuthRoute path="/campaigns" component={ Campaigns } />
        <AuthRoute path="/invoice" component={ Invoice } />
        <AuthRoute path="/userhistory" component={ UserHistory } />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
