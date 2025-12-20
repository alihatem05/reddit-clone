import React, { useState, useEffect } from "react";
import "./Navbar.css";
import reddit_logo_path from "./../../assets/Reddit-Logo.png";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./../../hooks/useAuthContext";
import { useLogout } from "./../../hooks/useLogout";
import CreatePost from "../CreatePost/CreatePost";

function Navbar() {
  const [communities, setCommunities] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { user }  = useAuthContext()
  const { logout } = useLogout()

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/communities`)
      .then((res) => res.json())
      .then(setCommunities)
      .catch((err) => console.log("Error fetching communities:", err));
    
    fetch(`${process.env.REACT_APP_API_URL}/api/users`)
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => console.log("Error fetching users:", err));
  }, []);

  const filteredCommunities = communities.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCommunityClick = (id) => {
    navigate(`/community/${id}`);
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleUserClick = (id) => {
    navigate(`/profile/${id}`);
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleLogout = (e) => {
    logout()
  };

  const handleProfile = (e) => {
    navigate('/profile')
  };

  const handleRedditLogo = (e) => {
    navigate('/')
  }

  const handleDoNothing = (e) => {
    
  }

  return (
    <>
      <nav aria-label="Primary navigation" id="navbar">
        <div id="nav-left">
          <a href="/" id="reddit-logo">
            <img src={reddit_logo_path} onClick={() => handleRedditLogo()} alt="RedditClone logo" width="115" height="32" />
          </a>

          <div id="searchbar-nav" role="search">
            <input
              id="searchBar"
              type="search"
              placeholder="Search Reddit"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowDropdown(true)}
            />
            {showDropdown && searchTerm && (
              <div className="search-dropdown">
                {filteredCommunities.length === 0 && filteredUsers.length === 0 && (
                  <p>No results found</p>
                )}
                {filteredCommunities.length > 0 && (
                  <>
                    <div className="dropdown-section-title">Communities</div>
                    {filteredCommunities.map((c) => (
                      <div
                        key={c._id}
                        className="dropdown-item"
                        onClick={() => handleCommunityClick(c._id)}
                      >
                        <i className="bi bi-reddit" style={{ marginRight: '8px' }}></i>
                        r/{c.name}
                      </div>
                    ))}
                  </>
                )}
                {filteredUsers.length > 0 && (
                  <>
                    <div className="dropdown-section-title">Users</div>
                    {filteredUsers.map((u) => (
                      <div
                        key={u._id}
                        className="dropdown-item"
                        onClick={() => handleUserClick(u._id)}
                      >
                        <img 
                          src={u.avatar?.startsWith('data:image/') ? u.avatar : `/pfps/${u.avatar || 'gray.png'}`} 
                          alt={u.username} 
                          style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '8px' }}
                        />
                        u/{u.username}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div id="nav-right">
          <a className="logo">
            <i className="bi bi-chat-dots" />
          </a>
          <a 
            className="logo"
            onClick={(e) => {
              e.preventDefault();
              if (user) {
                setShowCreatePost(true);
              }
            }}
          >
            <i className="bi bi-plus-square" />
          </a>
          <a className="logo">
            <i className="bi bi-bell" />
          </a>

          <div id="pSection">
            <img id="userProfilePfp" src={`/pfps/${user?.avatar}`} alt="User avatar" />
            <div id="dropdown">
              <p onClick={() => handleProfile()}>Account</p>
              <p onClick={() => handleLogout()}>Logout</p>
            </div>
          </div>
        </div>
      </nav>
      {showCreatePost && (
        <CreatePost
          onClose={() => setShowCreatePost(false)}
          onPostCreated={() => {
            setShowCreatePost(false);
            window.location.reload();
          }}
        />
      )}
    </>
  );
}

export default Navbar;
