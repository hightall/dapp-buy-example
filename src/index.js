import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

window.racaAddress = "0xC8C9b3749BE6F4C1170C3B0a4Ef530Ffa707bB28";
window.networkEnv = "test";
window.buyTokenAddress = "0x876B23260fe3C874cd5BD083736DDcBD4EBEA8bf";
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
