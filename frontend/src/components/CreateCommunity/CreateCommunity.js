import React, { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./CreateCommunity.css";

function CreateCommunity({ onClose, onCommunityCreated }) {
  const { user } = useAuthContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    topic: "",
    type: "public",
    name: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 4;

  const topics = [
    { value: "anime-cosplay", label: "Anime & Cosplay", color: "#FF4500", icon: "🎭" },
    { value: "art", label: "Art", color: "#FF6B6B", icon: "🎨" },
    { value: "business-finance", label: "Business & Finance", color: "#51CF66", icon: "📊" },
    { value: "collectibles-hobbies", label: "Collectibles & Other Hobbies", color: "#51CF66", icon: "⭐" },
    { value: "education-career", label: "Education & Career", color: "#4DABF7", icon: "📚" },
    { value: "fashion-beauty", label: "Fashion & Beauty", color: "#FFD43B", icon: "💎" },
    { value: "food-drinks", label: "Food & Drinks", color: "#FF922B", icon: "🍔" },
    { value: "games", label: "Games", color: "#9775FA", icon: "🎮" },
    { value: "health", label: "Health", color: "#FF6B9D", icon: "❤️" },
    { value: "home-garden", label: "Home & Garden", color: "#51CF66", icon: "🏠" },
    { value: "humanities-law", label: "Humanities & Law", color: "#FFD43B", icon: "📜" },
    { value: "identity-relationships", label: "Identity & Relationships", color: "#FF6B9D", icon: "🌈" },
    { value: "internet-culture", label: "Internet Culture", color: "#4DABF7", icon: "💻" },
    { value: "movies-tv", label: "Movies & TV", color: "#9775FA", icon: "🎬" },
    { value: "music", label: "Music", color: "#FF6B6B", icon: "🎵" },
    { value: "nature-outdoors", label: "Nature & Outdoors", color: "#51CF66", icon: "🌿" },
    { value: "news-politics", label: "News & Politics", color: "#FF4500", icon: "📰" },
    { value: "places-travel", label: "Places & Travel", color: "#4DABF7", icon: "🌍" },
    { value: "pop-culture", label: "Pop Culture", color: "#FFD43B", icon: "✨" },
    { value: "qas-stories", label: "Q&As & Stories", color: "#FF922B", icon: "✍️" },
    { value: "reading-writing", label: "Reading & Writing", color: "#4DABF7", icon: "📖" },
    { value: "sciences", label: "Sciences", color: "#51CF66", icon: "🧪" },
    { value: "spooky", label: "Spooky", color: "#9775FA", icon: "💀" },
    { value: "sports", label: "Sports", color: "#FFD43B", icon: "🏅" },
    { value: "technology", label: "Technology", color: "#9775FA", icon: "💻" },
    { value: "vehicles", label: "Vehicles", color: "#FF4500", icon: "🚗" },
    { value: "wellness", label: "Wellness", color: "#FFD43B", icon: "🧘" },
  ];

  const communityTypes = [
    {
      value: "public",
      title: "Public",
      description: "Anyone can view, post, and comment to this community",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor"/>
        </svg>
      )
    },
    {
      value: "restricted",
      title: "Restricted",
      description: "Anyone can view, but only approved users can contribute",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
          <path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" fill="currentColor" opacity="0.3"/>
        </svg>
      )
    },
    {
      value: "private",
      title: "Private",
      description: "Only approved users can view and contribute",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="currentColor"/>
        </svg>
      )
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleTypeSelect = (type) => {
    setFormData((prev) => ({
      ...prev,
      type: type,
    }));
  };

  const handleTopicSelect = (topic) => {
    setFormData((prev) => ({
      ...prev,
      topic: topic,
    }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!formData.name.trim()) {
        setError("Community name is required");
        return;
      }
      const nameRegex = /^[a-zA-Z0-9_]{3,21}$/;
      if (!nameRegex.test(formData.name.trim())) {
        setError("Community name must be 3-21 characters and contain only letters, numbers, and underscores");
        return;
      }
      setError("");
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Community name is required");
      return;
    }

    const nameRegex = /^[a-zA-Z0-9_]{3,21}$/;
    if (!nameRegex.test(formData.name.trim())) {
      setError("Community name must be 3-21 characters and contain only letters, numbers, and underscores");
      return;
    }

    if (!user || !user._id) {
      setError("You must be logged in to create a community");
      return;
    }

    setIsLoading(true);

    try {
      const communityData = {
        name: formData.name.trim().toLowerCase(),
        description: formData.description.trim(),
        type: formData.type,
        createdBy: user._id,
        logo: "https://st2.depositphotos.com/1432405/8410/v/450/depositphotos_84106432-stock-illustration-saturn-icon-simple.jpg",
      };

      const topic = formData.topic.trim();
      if (topic) {
        communityData.topic = topic;
      }

      const response = await fetch(`/api/communities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(communityData),
      });

      const text = await response.text().catch(() => null);
      let json = null;

      if (text) {
        try {
          json = JSON.parse(text);
        } catch (e) {
          setError("Failed to parse server response");
          setIsLoading(false);
          return;
        }
      }

      if (!response.ok) {
        setError(json?.error || "Failed to create community");
        setIsLoading(false);
        return;
      }

      if (onCommunityCreated) {
        onCommunityCreated(json);
      }
      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError(err.message || "Failed to create community");
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3 className="step-title">What will your community be about?</h3>
            <p className="step-description">
              Choose a topic to help redditors discover your community.
            </p>
            <div className="topics-grid">
              {topics.map((topic) => (
                <button
                  key={topic.value}
                  type="button"
                  className={`topic-button ${formData.topic === topic.value ? "selected" : ""}`}
                  onClick={() => handleTopicSelect(topic.value)}
                >
                  <div className="topic-icon" style={{ backgroundColor: topic.color }}>
                    {topic.icon}
                  </div>
                  <span className="topic-label">{topic.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h3 className="step-title">What kind of community is this?</h3>
            <p className="step-description">
              Decide who can view and contribute in your community. Only public communities show up in search.{" "}
              <strong>Important:</strong> Once set, you will need to submit a request to change your community type.
            </p>
            <div className="community-types">
              {communityTypes.map((type) => (
                <div
                  key={type.value}
                  className={`community-type-option ${formData.type === type.value ? "selected" : ""}`}
                  onClick={() => handleTypeSelect(type.value)}
                >
                  <div className="type-icon" style={{ color: formData.type === type.value ? '#D93900' : '#888' }}>
                    {type.icon}
                  </div>
                  <div className="type-content">
                    <div className="type-title">{type.title}</div>
                    <div className="type-description">{type.description}</div>
                  </div>
                  <div className="type-radio">
                    <div className={`radio-button ${formData.type === type.value ? "checked" : ""}`}>
                      {formData.type === type.value && <div className="radio-dot"></div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h3 className="step-title">Name your community</h3>
            <p className="step-description">
              Community names must be 3-21 characters and contain only letters, numbers, and underscores.
            </p>
            <div className="form-group">
              <label htmlFor="name">Community Name *</label>
              <div className="name-input-wrapper">
                <span className="name-prefix">r/</span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="communityname"
                  maxLength={21}
                  required
                  pattern="[a-zA-Z0-9_]{3,21}"
                  style={{ paddingLeft: '30px' }}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h3 className="step-title">Describe your community</h3>
            <p className="step-description">
              Add a description to help people understand what your community is about.
            </p>
            <div className="form-group">
              <label htmlFor="description">Description (optional)</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your community"
                rows={6}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="create-community-overlay" onClick={onClose}>
      <div className="create-community-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-community-header">
          <h2>Create a community</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="step-indicator">
          <div className="step-progress">
            <div 
              className="step-progress-bar" 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
          <div className="step-numbers">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`step-number ${currentStep >= step ? "active" : ""} ${currentStep === step ? "current" : ""}`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={currentStep === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="create-community-form">
          {renderStepContent()}

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <div className="step-navigation">
              {currentStep > 1 && (
                <button
                  type="button"
                  className="back-btn"
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className="submit-btn"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : currentStep === 4 ? "Create Community" : "Next"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCommunity;
