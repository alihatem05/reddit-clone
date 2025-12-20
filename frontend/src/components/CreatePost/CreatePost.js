import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import "./CreatePost.css";

function CreatePost({ onClose, onPostCreated, defaultCommunity = "" }) {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    community: defaultCommunity,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState(false);

  const fetchCommunities = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/communities`)
      .then((res) => res.json())
      .then(setCommunities)
      .catch((err) => console.log("Error fetching communities:", err));
  };

  useEffect(() => {
    fetchCommunities();
    
    const handleCommunityCreated = () => {
      fetchCommunities();
    };
    
    window.addEventListener('communityCreated', handleCommunityCreated);
    
    return () => {
      window.removeEventListener('communityCreated', handleCommunityCreated);
    };
  }, []);

  useEffect(() => {
    if (defaultCommunity) {
      setFormData(prev => ({ ...prev, community: defaultCommunity }));
    }
  }, [defaultCommunity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    
    if (name === "image" && value.trim()) {
      setImageError(false);
      setImagePreview(value.trim());
    } else if (name === "image" && !value.trim()) {
      setImagePreview(null);
      setImageError(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!formData.community) {
      setError("Please select a community");
      return;
    }

    if (!user || !user._id) {
      setError("You must be logged in to create a post");
      return;
    }

    setIsLoading(true);

    try {
      const postData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        user: user._id,
        community: formData.community,
      };
      
      const imageUrl = formData.image.trim();
      if (imageUrl) {
        postData.image = imageUrl;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
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
        setError(json?.error || "Failed to create post");
        setIsLoading(false);
        return;
      }

      if (onPostCreated) {
        onPostCreated(json);
      }
      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError(err.message || "Failed to create post");
      setIsLoading(false);
    }
  };

  return (
    <div className="create-post-overlay" onClick={onClose}>
      <div className="create-post-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-post-header">
          <h2>Create a post</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="community">Choose a community *</label>
            <select
              id="community"
              name="community"
              value={formData.community}
              onChange={handleChange}
              required
            >
              <option value="">Select a community</option>
              {communities.map((c) => (
                <option key={c._id} value={c._id}>
                  r/{c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">Post Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              maxLength={300}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter post description"
              rows={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL (optional)</label>
            <input
              id="image"
              name="image"
              type="text"
              value={formData.image}
              onChange={handleChange}
              placeholder="Enter any image URL (e.g., https://example.com/image.jpg)"
            />
            {imagePreview && (
              <div className="image-preview-container">
                {imageError ? (
                  <div className="image-preview-error">
                    <p>Unable to load image preview</p>
                    <small>The image may still work when posted, but preview failed to load.</small>
                  </div>
                ) : (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="image-preview"
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    crossOrigin="anonymous"
                  />
                )}
                <button 
                  type="button" 
                  className="remove-image-btn"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, image: "" }));
                    setImagePreview(null);
                    setImageError(false);
                  }}
                >
                  Remove Image
                </button>
              </div>
            )}
            <small style={{ color: '#80A2Aa', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              Enter any image URL. The image will be displayed in your post.
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
              {isLoading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;

