import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import Modal from 'react-modal';
require('react-web-vector-icons/fonts');


const token = localStorage.getItem("jToken");

if (token === null) {
  document.body.classList.add("token-present");
  document.body.classList.remove("no-token");
} else {
  document.body.classList.add("no-token");
  document.body.classList.remove("token-present");
}

Modal.setAppElement('#root');

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
