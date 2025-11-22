import React, { useState } from "react";
import './EmailLinkLogin.css';

function EmailLinkLogin({ closeModal }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // Check if the email input is valid
  const isValidEmail = email.includes("@") && email.trim() !== "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidEmail) {
      setError("Please enter a valid email address");
      return;
    }
    alert("Login link sent to: " + email);
    closeModal(); // Close the modal to show Navbar + Sidebar
  };

  return (
    <div className="modal-overlay">
      <div className="auth-card" style={{ position: "relative" }}>
        {/* Left arrow back */}
        <span
          style={{
            cursor: "pointer",
            fontSize: "1.5rem",
            position: "absolute",
            top: "0.5rem",
            left: "0.75rem",
          }}
          onClick={closeModal} // close modal instead of navigating
        >
          ←
        </span>

        <h3 className="auth-title text-center mb-3">Email me a one-time link</h3>

        <form onSubmit={handleSubmit}>
          <div className="auth-input">
            <span>Email Address</span>
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(""); // reset error on change
              }}
            />
          </div>
          {error && <div className="auth-error">{error}</div>}

          <button
            type="submit"
            className="auth-button"
            disabled={!isValidEmail}
            style={{
              opacity: !isValidEmail ? 0.5 : 1,
              cursor: !isValidEmail ? "not-allowed" : "pointer",
            }}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default EmailLinkLogin;
