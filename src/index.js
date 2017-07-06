import React from 'react';
import {render} from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

const initialState = {
  items:[],
  cities:[]
};

const dataReducer = (state=initialState, action) => {
  switch (action.type) {
    case "FETCH_DATA_SUCCESS":
      return {
        ...state, items: action.payload.items
      };
    case "FETCH_CITIES_SUCCESS":
      return{
        ...state, cities: action.payload
      };
    default:
      return state
  }
  // if(action.type === 'FETCH_DATA_SUCCESS') {
  //   return {
  //     ...state, items: action.payload.items
  //   }
  // }
};

const store = createStore(dataReducer, composeWithDevTools(applyMiddleware(thunk)));
const rootEl = document.getElementById('root');


const renderApp = () => {
  render(
    <Provider store={store}>
      <App/>
    </Provider>, rootEl
  );
};

renderApp();
if (module.hot) {
  module.hot.accept(()=>{
    renderApp();
  });
}
