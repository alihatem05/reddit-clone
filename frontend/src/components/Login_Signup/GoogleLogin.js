import './GoogleLogin.css';

function GoogleLogin({ closeModal }) {
  const handleGoogleLogin = () => {
    alert("Logged in with Google!");
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
        <h3 className="auth-title text-center mt-3">Continue with Google</h3>

        {/* Button */}
        <button
          className="auth-button mt-4"
          onClick={handleGoogleLogin}
        >
          Sign in with Google
        </button>

      </div>
    </div>
  );
}

export default GoogleLogin;
