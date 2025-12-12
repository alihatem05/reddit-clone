import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "./../../hooks/useRegister"
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { register, error } = useRegister();

  const handleRegister = async (e) => {
    e.preventDefault();
    const result = await register(username, email, password);
    if (result) {
      navigate('/');
    }
  };

  return (
    <div className="register-page">
      <div className="register-card relative-box">
        <div id="registerHeader">
            <img id="redditRegisterLogo" src="https://1000logos.net/wp-content/uploads/2017/05/Reddit-Logo.png" />
            <h3 className="register-title text-center mb-3">Register</h3>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="register-input">
            <span>Username</span>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="register-input">
            <span>Email</span>
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="register-input">
            <span>Password</span>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="register-button" type="submit">Register</button>
        </form>

        <p className="login-text text-center mt-3" onClick={() => navigate('/login')}>Login</p>
      </div>
    </div>
  );
}

export default Register;
