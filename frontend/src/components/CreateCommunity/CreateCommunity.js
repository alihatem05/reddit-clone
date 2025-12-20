import React, { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./CreateCommunity.css";

function CreateCommunity({ onClose, onCommunityCreated }) {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    type: "public",
    name: "",
    description: "",
    logo: "",
    backgroundImage: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [backgroundPreview, setBackgroundPreview] = useState(null);
  const [logoError, setLogoError] = useState(false);
  const [backgroundError, setBackgroundError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");

    if (name === "logo" && value.trim()) {
      setLogoError(false);
      setLogoPreview(value.trim());
    } else if (name === "logo" && !value.trim()) {
      setLogoPreview(null);
      setLogoError(false);
    }

    if (name === "backgroundImage" && value.trim()) {
      setBackgroundError(false);
      setBackgroundPreview(value.trim());
    } else if (name === "backgroundImage" && !value.trim()) {
      setBackgroundPreview(null);
      setBackgroundError(false);
    }
  };

  const handleLogoError = () => {
    setLogoError(true);
  };

  const handleLogoLoad = () => {
    setLogoError(false);
  };

  const handleBackgroundError = () => {
    setBackgroundError(true);
  };

  const handleBackgroundLoad = () => {
    setBackgroundError(false);
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
      };

      const logoUrl = formData.logo.trim();
      if (logoUrl) {
        communityData.logo = logoUrl;
      } else {
        communityData.logo = "https://st2.depositphotos.com/1432405/8410/v/450/depositphotos_84106432-stock-illustration-saturn-icon-simple.jpg";
      }

      const backgroundUrl = formData.backgroundImage.trim();
      if (backgroundUrl) {
        communityData.backgroundImage = backgroundUrl;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/communities`, {
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

  return (
    <div className="create-community-overlay" onClick={onClose}>
      <div className="create-community-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-community-header">
          <h2>Create a community</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-community-form">
          <div className="form-group">
            <label htmlFor="name">Community Name *</label>
            <div className="name-input-wrapper">
              <span className="name-prefix"></span>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Community Name"
                maxLength={21}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="type">Community Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="public">Public</option>
              <option value="restricted">Restricted</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your community"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="logo">Profile Image URL (optional)</label>
            <input
              id="logo"
              name="logo"
              type="text"
              value={formData.logo}
              onChange={handleChange}
              placeholder="Enter image URL for community profile"
            />
            {logoPreview && (
              <div className="image-preview-container">
                {logoError ? (
                  <div className="image-preview-error">
                    <p>Unable to load image preview</p>
                    <small>The image may still work when saved, but preview failed to load.</small>
                  </div>
                ) : (
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="image-preview logo-preview"
                    onError={handleLogoError}
                    onLoad={handleLogoLoad}
                    crossOrigin="anonymous"
                  />
                )}
                <button 
                  type="button" 
                  className="remove-image-btn"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, logo: "" }));
                    setLogoPreview(null);
                    setLogoError(false);
                  }}
                >
                  Remove Image
                </button>
              </div>
            )}
            <small style={{ color: '#80A2Aa', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              Enter an image URL for your community profile. If not provided, a default image will be used.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="backgroundImage">Background Image URL (optional)</label>
            <input
              id="backgroundImage"
              name="backgroundImage"
              type="text"
              value={formData.backgroundImage}
              onChange={handleChange}
              placeholder="Enter image URL for community background"
            />
            {backgroundPreview && (
              <div className="image-preview-container">
                {backgroundError ? (
                  <div className="image-preview-error">
                    <p>Unable to load image preview</p>
                    <small>The image may still work when saved, but preview failed to load.</small>
                  </div>
                ) : (
                  <img 
                    src={backgroundPreview} 
                    alt="Background preview" 
                    className="image-preview background-preview"
                    onError={handleBackgroundError}
                    onLoad={handleBackgroundLoad}
                    crossOrigin="anonymous"
                  />
                )}
                <button 
                  type="button" 
                  className="remove-image-btn"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, backgroundImage: "" }));
                    setBackgroundPreview(null);
                    setBackgroundError(false);
                  }}
                >
                  Remove Image
                </button>
              </div>
            )}
            <small style={{ color: '#80A2Aa', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              Enter an image URL for your community background.
            </small>
          </div>

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
            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Community"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCommunity;
