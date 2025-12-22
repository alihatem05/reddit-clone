import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "bootstrap-icons/font/bootstrap-icons.css";
import ScrollBar from "./components/scrollbar"
import { AuthContextProvider } from './AuthContext'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <ScrollBar />
        <App />
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);