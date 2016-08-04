import {Provider} from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import configureStore from './state/configureStore';

import './index.css';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
