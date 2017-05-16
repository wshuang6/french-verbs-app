import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
import './index.css';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import reducers from './reducers';
import Quiz from './components/quiz';

const store = createStore(reducers, 
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), 
  applyMiddleware(thunk)
);

ReactDOM.render(
  <Provider store={store}>
    <Quiz />
  </Provider>,
  document.getElementById('root')
);
