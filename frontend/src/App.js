import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Register from "./components/Login_Signup/Register";
import PhoneLogin from "./components/Login_Signup/PhoneLogin";
import Login from "./components/Login_Signup/Login";
import GoogleLogin from "./components/Login_Signup/GoogleLogin";
import AppleLogin from "./components/Login_Signup/AppleLogin";
import EmailLinkLogin from "./components/Login_Signup/EmailLinkLogin";
import HomePage from "./components/Home-Page/Home-Page"
import "./App.css"

function App() {
  const [modal, setModal] = useState(null);

  const closeModal = () => setModal(null);
  return (
    <div>
        <Navbar />
        <div id="mainPage">
            <Sidebar />
            <HomePage />
        </div>

        {modal === "login" && <Login closeModal={closeModal} />}
        {modal === "register" && <Register closeModal={closeModal} />}
        {modal === "phone-login" && <PhoneLogin closeModal={closeModal} />}
        {modal === "google-login" && <GoogleLogin closeModal={closeModal} />}
        {modal === "apple-login" && <AppleLogin closeModal={closeModal} />}
        {modal === "email-link-login" && <EmailLinkLogin closeModal={closeModal} />}
    </div>
  );
}

export default App;