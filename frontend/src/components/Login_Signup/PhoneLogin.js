import './PhoneLogin.css';
import { useState } from "react";

function PhoneLogin({ closeModal }) {
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [error, setError] = useState("");

  const countries = [
    { name: "United States", code: "+1", abbr: "US", minLength: 10, maxLength: 10 },
    { name: "United Kingdom", code: "+44", abbr: "GB", minLength: 10, maxLength: 10 },
    { name: "India", code: "+91", abbr: "IN", minLength: 10, maxLength: 10 },
    { name: "Saudi Arabia", code: "+966", abbr: "SA", minLength: 9, maxLength: 9 },
    { name: "United Arab Emirates", code: "+971", abbr: "AE", minLength: 9, maxLength: 9 },
    { name: "Morocco", code: "+212", abbr: "MA", minLength: 9, maxLength: 9 },
    { name: "Egypt", code: "+20", abbr: "EG", minLength: 9, maxLength: 9 },
    { name: "Jordan", code: "+962", abbr: "JO", minLength: 9, maxLength: 9 },
    { name: "Kuwait", code: "+965", abbr: "KW", minLength: 8, maxLength: 8 },
    { name: "Qatar", code: "+974", abbr: "QA", minLength: 8, maxLength: 8 },
    { name: "Oman", code: "+968", abbr: "OM", minLength: 8, maxLength: 8 },
    { name: "Bahrain", code: "+973", abbr: "BH", minLength: 8, maxLength: 8 },
    { name: "Lebanon", code: "+961", abbr: "LB", minLength: 8, maxLength: 8 },
  ];

  const selected = countries.find((c) => c.code === countryCode) || countries[0];

  const onlyDigits = /^\d+$/.test(phone);
  const isCorrectLength =
    phone.length >= selected.minLength && phone.length <= selected.maxLength;
  const isValidPhone = onlyDigits && isCorrectLength;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidPhone) {
      setError(
        `Enter a valid phone number for ${selected.name} (${selected.minLength}–${selected.maxLength} digits)`
      );
      return;
    }
    alert(`Phone login successful: ${countryCode} ${phone}`);
    closeModal(); // close modal to show Navbar + Sidebar
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
          onClick={closeModal} // close modal instead of navigate
        >
          ←
        </span>

        <h3 className="auth-title text-center mb-3">
          Continue with Phone Number
        </h3>

        <form onSubmit={handleSubmit}>
          <div
            className="auth-input"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <select
              value={countryCode}
              onChange={(e) => {
                setCountryCode(e.target.value);
                setError("");
              }}
              style={{
                borderRadius: "5px",
                padding: "0.4rem",
                border: "1px solid #ccc",
                backgroundColor: "#f0f0f0",
                fontWeight: "bold",
                fontSize: "0.9rem",
                minWidth: "100px",
                flexShrink: 0,
              }}
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.abbr} {c.name} ({c.code})
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setError("");
              }}
              style={{ flex: 1, padding: "0.5rem" }}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button
            type="submit"
            className="auth-button"
            disabled={!isValidPhone}
            style={{
              opacity: !isValidPhone ? 0.5 : 1,
              cursor: !isValidPhone ? "not-allowed" : "pointer",
            }}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default PhoneLogin;
