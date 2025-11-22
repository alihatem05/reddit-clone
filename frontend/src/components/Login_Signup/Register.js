import React, { useState } from "react";
import "./Register.css";

const Register = ({ closeModal }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    gender: "",
    interests: [],
  });
  const [errors, setErrors] = useState({});

  const interestsList = [
    "📈 Popular","🌐 Places & Travel","✏️ Q&As & Stories","💵 Business & Finance",
    "🙉 Internet Culture","🧑‍🏫 Education & Career","🛰️ Technology","🕹️ Games",
    "🎞️ Movies & TV","📰 News & Politics","🏅 Sports","✨ Pop Culture","📜 Humanities & Law",
    "🏡 Home & Garden","🪞 Fashion & Beauty","🚗 Vehicles","🍔 Food & Drinks","🧪 Sciences",
    "🍣 Anime & Cosplay","📖 Reading & Writing","🧘 Wellness","🧑‍🎨 Art","🎶 Music",
    "💀 Spooky","🧩 Collectibles & Other Hobbies","🌿 Nature & Outdoors",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      let newInterests = [...form.interests];
      if (checked) newInterests.push(value);
      else newInterests = newInterests.filter((i) => i !== value);
      setForm({ ...form, interests: newInterests });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!form.email) newErrors.email = "Email is required";
      else if (!form.email.includes("@")) newErrors.email = "Email must include '@'";
    }
    if (step === 2) {
      if (!form.username || form.username.length < 3)
        newErrors.username = "Username must be at least 3 characters";
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
      if (!passwordPattern.test(form.password))
        newErrors.password = "Password must include uppercase, lowercase, number & special char";
    }
    if (step === 3 && !form.gender)
      newErrors.gender = "Please select your identity";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
  };

  const handleSubmit = () => {
    localStorage.setItem("user", JSON.stringify(form));
    alert("Registration complete!");
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="auth-card">
        {/* Close button */}
        <span className="close-btn" onClick={closeModal}>✕</span>

        {/* Step 1: Email */}
        {step === 1 && (
          <>
            <h3 className="auth-title text-center mb-3">Sign Up</h3>
            <div className="auth-input">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <div className="auth-error">{errors.email}</div>}
            <button className="auth-button" onClick={nextStep} disabled={!form.email.includes("@")}>Continue</button>
          </>
        )}

        {/* Step 2: Username & Password */}
        {step === 2 && (
          <>
            <span className="back-btn" onClick={() => setStep(step - 1)}>←</span>
            <h3 className="auth-title text-center mb-3">Username & Password</h3>
            <div className="auth-input">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
              />
            </div>
            {errors.username && <div className="auth-error">{errors.username}</div>}
            <div className="auth-input">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            {errors.password && <div className="auth-error">{errors.password}</div>}
            <button className="auth-button mt-4" onClick={nextStep}>Continue</button>
          </>
        )}

        {/* Step 3: Gender */}
        {step === 3 && (
          <>
            <span className="back-btn" onClick={() => setStep(step - 1)}>←</span>
            <h3 className="auth-title text-center mb-3">About You</h3>
            <div className="d-flex flex-wrap justify-content-center">
              {["Woman", "Man", "Non-binary", "I prefer not to say"].map(option => (
                <div
                  key={option}
                  className={`auth-gender-btn ${form.gender === option ? "selected" : ""}`}
                  onClick={() => setForm({ ...form, gender: option })}
                >
                  {option}
                </div>
              ))}
            </div>
            {errors.gender && <div className="auth-error">{errors.gender}</div>}
            <button className="auth-button mt-4" onClick={nextStep}>Continue</button>
          </>
        )}

        {/* Step 4: Interests */}
        {step === 4 && (
          <>
            <span className="back-btn" onClick={() => setStep(step - 1)}>←</span>
            <h3 className="auth-title text-center mb-3">Interests</h3>
            <p className="text-center">Pick topics you like:</p>
            <div className="d-flex flex-wrap justify-content-center" style={{ maxHeight: "300px", overflowY: "auto" }}>
              {interestsList.map(topic => (
                <div
                  key={topic}
                  className={`auth-interest-btn ${form.interests.includes(topic) ? "selected" : ""}`}
                  onClick={() => {
                    let newInterests = [...form.interests];
                    if (newInterests.includes(topic)) newInterests = newInterests.filter(i => i !== topic);
                    else newInterests.push(topic);
                    setForm({ ...form, interests: newInterests });
                  }}
                >
                  {topic}
                </div>
              ))}
            </div>
            <button className="auth-button mt-4" onClick={handleSubmit}>Finish</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
