import { useNavigate } from "react-router-dom";
import { useLogin } from "./../../hooks/useLogin"
import React, { useState } from "react";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()
  const { login, error } = useLogin()

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const result = await login(email, password);
    if (result) {
      navigate('/');
    }
  };

  return (
    <div className="login-page">
      <div className="auth-card relative-box">
        <div id="loginHeader">
            <img id="redditLoginLogo" src="https://1000logos.net/wp-content/uploads/2017/05/Reddit-Logo.png" />
            <h3 className="auth-title text-center mb-3">Log In</h3>
        </div>

        <form onSubmit={handleLogin}>
          <div className="auth-input">
            <span>Email or Username</span>
            <input
              type="text"
              placeholder="Enter your email or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="auth-input">
            <span>Password</span>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="auth-button" type="submit">Log In</button>
        </form>

        <p className="forgot-text text-center mt-3" onClick={() => navigate('/register')}>Register</p>
      </div>
    </div>
  );
}

export default Login;
