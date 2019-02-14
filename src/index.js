import React from 'react';
import ReactDOM from 'react-dom';
import jQuery from 'jquery';
import popper from 'popper.js';
import 'bootstrap/dist/css/bootstrap.css'
import Auth from './Auth'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers/rootReducer'

const store = createStore(rootReducer);


ReactDOM.render(
  <Provider store={store}>
  <Auth />
  </Provider>,
  document.getElementById('app')
);

module.hot.accept();