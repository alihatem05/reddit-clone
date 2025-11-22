import './AppleLogin.css';

function AppleLogin({ closeModal }) {
  const handleAppleLogin = () => {
    alert("Logged in with Apple!");
    closeModal(); // close modal to show Navbar + Sidebar
  };

  return (
    <div className="modal-overlay">
      <div className="auth-card">

        {/* Left Arrow */}
        <div
          style={{ position: "absolute", top: "10px", left: "10px", cursor: "pointer", fontSize: "1.5rem" }}
          onClick={closeModal} // close modal instead of navigating
        >
          ←
        </div>

        {/* Title */}
        <h3 className="auth-title text-center mt-3">Continue with Apple</h3>

        {/* Button */}
        <button
          className="auth-button mt-4"
          onClick={handleAppleLogin}
        >
          Sign in with Apple
        </button>

      </div>
    </div>
  );
}

export default AppleLogin;
