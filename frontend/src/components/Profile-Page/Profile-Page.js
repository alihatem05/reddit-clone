import React, { useState, useRef, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./Profile-Page.css";
import useDisplayPost from '../../hooks/useDisplayPost';
import Post from '../Post/Post';
import EditProfileModal from './EditProfileModal';

const tabs = ["Posts", "Comments", "Upvoted", "Downvoted"];

const EmptyState = ({ title }) => (
  <div className="empty-state">
    <div className="overview-snoo-container">
      <img
        src="https://www.redditstatic.com/shreddit/assets/snoomojis/Snoo_Expression_NoMouth.png"
        alt="Snoo"
        width="128"
        loading="lazy"
      />
    </div>
    <div className="no-posts-container">
      <div className="no-posts-message">
        <div className="no-posts-title">{title}</div>
      </div>
    </div>
  </div>
);

const ProfilePage = () => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState("Posts");
  const tabsRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const displayPost = useDisplayPost();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (!user || !user._id) return;
    fetch(`/api/users/${user._id}`)
      .then((res) => res.json())
      .then((data) => setPosts(data.posts || []))
      .catch(console.log);
  }, [user]);

  if (!user) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading user data...</p>;
  }

  const avatar = user.avatar || "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png";
  const username = user.username || "Unknown";

  const scrollTabs = (direction) => {
    if (tabsRef.current) {
      const scrollAmount = 150;
      tabsRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const emptyMessages = {
    Posts: `You don't have any posts yet`,
    Comments: "You don't have any comments yet",
    Upvoted: "You haven't upvoted anything yet",
    Downvoted: "You haven't downvoted anything yet",
  };

  return (
    <div className="profile-page">
      <div className="profile-main-container">
        <div className="profile-main">
          <div className="profile-header">
            <div className="avatar-container">
              <img 
                src={user?.avatar?.startsWith('data:image/') ? user.avatar : `/pfps/${user?.avatar || 'gray.png'}`} 
                alt={`${username} avatar`} 
                className="profile-avatar" 
              />
              <button 
                className="edit-avatar-btn" 
                aria-label="Edit profile avatar"
                onClick={() => setIsEditModalOpen(true)}
              >
                ✎
              </button>
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{username}</h1>
              <p className="profile-username">u/{username}</p>
            </div>
           
          </div>
					<div className="profile-summary-row">
            <div className="stat-list">
              <div className="stat-item">
                <p className="stat-title">Email</p>
                <p className="stat-value">{user.email}</p>
              </div>
              <div className="stat-item">
                <p className="stat-title">Karma</p>
                <p className="stat-value">{user.karma || 0}</p>
              </div>
              <div className="stat-item">
                <p className="stat-title">Posts</p>
                <p className="stat-value">{posts.length}</p>
              </div>
            </div>
          </div>
          <div className="tabs-container">
            <button 
              className="tab-arrow" 
              onClick={() => scrollTabs("left")}
              aria-label="Scroll tabs left"
            >
              ‹
            </button>
            <div className="profile-tabs" role="tablist" ref={tabsRef}>
              {tabs.map((tab) => (
                <span
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  className={activeTab === tab ? "active-tab" : ""}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </span>
              ))}
            </div>
            <button 
              className="tab-arrow" 
              onClick={() => scrollTabs("right")}
              aria-label="Scroll tabs right"
            >
              ›
            </button>
          </div>
					<div style={{ height: "1px", width: "100%", backgroundColor: "#3E4142", marginTop: "15px", marginBottom: "15px"}}></div>
          <div className="tab-content">
            {activeTab === "Posts" && (
              <div className="tab-section">
                <button className="postButtonProf">Create Post</button>
                {posts.length === 0 ? (
                  <EmptyState title={emptyMessages.Posts} />
                ) : (
                  <div className="user-posts-list">
                    {posts.map((p) => (
                      <div key={p._id} style={{ marginBottom: '12px' }}>
                        <Post post={p} user={p.user} community={p.community} readOnly={true} onClick={() => displayPost(p._id)} />
                        <div style={{ height: "1px", width: "590px", backgroundColor: "#3E4142", marginTop: "15px", marginBottom: "15px"}} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {["Comments", "Upvoted", "Downvoted"].includes(activeTab) && (
              <EmptyState title={emptyMessages[activeTab]} />
            )}
          </div>
        </div>
      </div>
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
      />
    </div>
  );
};

export default ProfilePage;
