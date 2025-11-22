import React, { useState } from "react";
import "./Login.css";
import Register from "./Register.js";

const Login = ({ closeModal }) => {
  const [activeLoginMethod, setActiveLoginMethod] = useState("main"); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [resetEmail, setResetEmail] = useState("");
  const [showResetPopup, setShowResetPopup] = useState(false);

  const countries = [
    { name: "United States", code: "+1", minLength: 10, maxLength: 10 },
    { name: "India", code: "+91", minLength: 10, maxLength: 10 },
    { name: "Egypt", code: "+20", minLength: 9, maxLength: 9 },
  ];

  const selectedCountry = countries.find(c => c.code === countryCode) || countries[0];

  const isPhoneValid = /^\d+$/.test(phone) && phone.length >= selectedCountry.minLength && phone.length <= selectedCountry.maxLength;
  const isEmailValid = email.includes("@") && email.trim() !== "";
  const isLoginDisabled = email.trim() === "" || password.trim() === "";

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("isLoggedIn", true);
    closeModal();
  };

  const handlePhoneLogin = (e) => {
    e.preventDefault();
    alert(`Phone login: ${countryCode} ${phone}`);
    closeModal();
  };

  const handleReset = (e) => {
    e.preventDefault();
    alert(`Reset link sent to: ${resetEmail}`);
    setShowResetPopup(false);
    setResetEmail("");
  };

  return (
    <div className="modal-overlay">
      {activeLoginMethod === "register" ? (
        <Register closeModal={closeModal} />
      ) : (
        <div className="auth-card relative-box">
          <span className="close-btn" onClick={closeModal}>✕</span>

          {activeLoginMethod === "main" && (
            <>
              <h3 className="auth-title text-center mb-3">Log In</h3>

              <div className="auth-alt-buttons">
                <button className="auth-alt-button phone" onClick={() => setActiveLoginMethod("phone")}>📱 Continue with Phone</button>
                <button className="auth-alt-button google" onClick={() => setActiveLoginMethod("google")}>🟢 Continue with Google</button>
                <button className="auth-alt-button apple" onClick={() => setActiveLoginMethod("apple")}> Continue with Apple</button>
                <button className="auth-alt-button link" onClick={() => setActiveLoginMethod("email")}>📧 Email me a one-time link</button>
              </div>

              <div className="or-line"><hr /> <span>OR</span> <hr /></div>

              <form onSubmit={handleLogin}>
                <div className="auth-input">
                  <span>Email or Username</span>
                  <input
                    type="text"
                    placeholder="Enter your email or username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="auth-input">
                  <span>Password</span>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button className={`auth-button ${isLoginDisabled ? "disabled-btn" : ""}`} disabled={isLoginDisabled}>Log In</button>

                <p className="auth-link text-center mt-3 forgot-text" onClick={() => setShowResetPopup(true)}>Forgot password?</p>
                <p className="text-center mt-3">New to Reddit? <span className="auth-link" onClick={() => setActiveLoginMethod("register")}>Sign Up</span></p>
              </form>
            </>
          )}

          {activeLoginMethod === "phone" && (
            <>
              <div className="back-btn" onClick={() => setActiveLoginMethod("main")}>←</div>
              <h3 className="auth-title text-center mb-3">Phone Login</h3>
              <form onSubmit={handlePhoneLogin}>
                <div className="auth-input" style={{ flexDirection: "row", gap: "0.5rem" }}>
                  <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
                    {countries.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
                  </select>
                  <input
                    type="text"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <button className={`auth-button ${!isPhoneValid ? "disabled-btn" : ""}`} disabled={!isPhoneValid}>Continue</button>
              </form>
            </>
          )}

          {activeLoginMethod === "google" && (
            <>
              <div className="back-btn" onClick={() => setActiveLoginMethod("main")}>←</div>
              <h3 className="auth-title text-center mb-3">Google Login</h3>
              <button className="auth-button" onClick={() => { alert("Logged in with Google!"); closeModal(); }}>Continue with Google</button>
            </>
          )}

          {activeLoginMethod === "apple" && (
            <>
              <div className="back-btn" onClick={() => setActiveLoginMethod("main")}>←</div>
              <h3 className="auth-title text-center mb-3">Apple Login</h3>
              <button className="auth-button" onClick={() => { alert("Logged in with Apple!"); closeModal(); }}>Continue with Apple</button>
            </>
          )}

          {activeLoginMethod === "email" && (
            <>
              <div className="back-btn" onClick={() => setActiveLoginMethod("main")}>←</div>
              <h3 className="auth-title text-center mb-3">Email Link Login</h3>
              <form onSubmit={(e) => { e.preventDefault(); alert(`Link sent to ${email}`); closeModal(); }}>
                <div className="auth-input">
                  <input type="text" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <button className={`auth-button ${!isEmailValid ? "disabled-btn" : ""}`} disabled={!isEmailValid}>Send Link</button>
              </form>
            </>
          )}
        </div>
      )}

      {showResetPopup && (
        <div className="popup-overlay">
          <div className="auth-card relative-box">
            <span className="close-btn" onClick={() => setShowResetPopup(false)}>✕</span>
            <span className="back-btn" onClick={() => setShowResetPopup(false)}>←</span>
            <h4 className="auth-title text-center">Reset Password</h4>
            <form onSubmit={handleReset}>
              <div className="auth-input">
                <input type="text" placeholder="Email or Username" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required />
              </div>
              <button className={`auth-button ${resetEmail.trim() === "" ? "disabled-btn" : ""}`} disabled={resetEmail.trim() === ""}>Reset Password</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
