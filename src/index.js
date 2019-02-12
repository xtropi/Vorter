import React from 'react';
import ReactDOM from 'react-dom';
import jQuery from 'jquery';
import popper from 'popper.js';
import 'bootstrap/dist/css/bootstrap.css'
import Auth from './Auth'

ReactDOM.render(
  <Auth />,
  document.getElementById('app')
);

module.hot.accept();