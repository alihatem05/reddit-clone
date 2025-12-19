import React, { useState, useEffect } from 'react';
import { useUpdateProfile } from '../../hooks/useUpdateProfile';
import './EditProfileModal.css';

const EditProfileModal = ({ isOpen, onClose, user }) => {
  const { updateProfile, isLoading, error } = useUpdateProfile();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    avatar: ''
  });
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [customAvatarFile, setCustomAvatarFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const availableAvatars = [
    'blue.png',
    'brown.png',
    'gray.png',
    'green.png',
    'orange.png',
    'pink.png',
    'red.png',
    'yellow.png'
  ];

  useEffect(() => {
    if (user && isOpen) {
      const currentAvatar = user.avatar || 'gray.png';
      setFormData({
        username: user.username || '',
        email: user.email || '',
        avatar: currentAvatar
      });
      setSelectedAvatar(currentAvatar);
      if (currentAvatar.startsWith('data:image/')) {
        setAvatarPreview(currentAvatar);
      } else {
        setAvatarPreview(`/pfps/${currentAvatar}`);
      }
      setSuccessMessage('');
      setCustomAvatarFile(null);
    }
  }, [user, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarSelect = (avatarName) => {
    setSelectedAvatar(avatarName);
    setAvatarPreview(`/pfps/${avatarName}`);
    setFormData(prev => ({ ...prev, avatar: avatarName }));
    setCustomAvatarFile(null);
    setShowAvatarSelector(false);
  };

  const handleCustomAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setCustomAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setAvatarPreview(base64String);
        setFormData(prev => ({ ...prev, avatar: base64String }));
      };
      reader.readAsDataURL(file);
      setShowAvatarSelector(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    const updates = {};
    if (formData.username !== user.username) {
      updates.username = formData.username;
    }
    if (formData.email !== user.email) {
      updates.email = formData.email;
    }
    if (formData.avatar !== user.avatar) {
      updates.avatar = formData.avatar;
    }

    if (Object.keys(updates).length === 0) {
      onClose();
      return;
    }

    const updatedUser = await updateProfile(user._id, updates);
    
    if (updatedUser) {
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-profile" onClick={onClose}>
      <div className="edit-profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-section">
            <label className="form-label">Profile Picture</label>
            <div className="avatar-edit-container">
              <div className="avatar-preview-wrapper">
                <img 
                  src={avatarPreview} 
                  alt="Avatar preview" 
                  className="avatar-preview"
                />
              </div>
              <div className="avatar-options">
                <button
                  type="button"
                  className="avatar-option-btn"
                  onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                >
                  Choose from Gallery
                </button>
                <label className="avatar-option-btn file-upload-label">
                  Upload Custom Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomAvatarUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              {showAvatarSelector && (
                <div className="avatar-gallery">
                  {availableAvatars.map((avatar) => (
                    <div
                      key={avatar}
                      className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`}
                      onClick={() => handleAvatarSelect(avatar)}
                    >
                      <img src={`/pfps/${avatar}`} alt={avatar} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="form-input"
              required
              minLength={3}
              maxLength={20}
            />
          </div>

          <div className="form-section">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          {error && (
            <div className="error-message">{error}</div>
          )}

          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

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
              className="save-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
