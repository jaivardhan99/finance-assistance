import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './store/store';
import './index.css';
import axios from 'axios';

// Configure axios globally
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
