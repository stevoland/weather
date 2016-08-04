import {combineReducers, createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';

import forecastReducer from './forecast';

const reducer = combineReducers({
  forecast: forecastReducer
});

export default function configureStore(preloadedState) {
  const middleware = [
    thunkMiddleware
  ];

  if (process.env.NODE_ENV !== 'production') {
    middleware.push(require('redux-freeze'));
  }

  return createStore(
    reducer,
    preloadedState,
    applyMiddleware(...middleware)
  );
}
