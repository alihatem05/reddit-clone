import React, { useState, useEffect } from "react";
import "./Navbar.css";
import reddit_logo_path from "./../../assets/Reddit-Logo.png";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./../../hooks/useAuthContext";

function Navbar() {
  const [communities, setCommunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { user }  = useAuthContext()

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5005/api/communities")
      .then((res) => res.json())
      .then(setCommunities)
      .catch((err) => console.log("Error fetching communities:", err));
  }, []);

  const filteredCommunities = communities.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCommunityClick = (id) => {
    navigate(`/community/${id}`);
    setSearchTerm("");
    setShowDropdown(false);
  };

  return (
    <>
      <nav aria-label="Primary navigation" id="navbar">
        <div id="nav-left">
          <a href="/" id="reddit-logo">
            <img src={reddit_logo_path} alt="RedditClone logo" width="115" height="32" />
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
                {filteredCommunities.length === 0 && <p>No communities found</p>}
                {filteredCommunities.map((c) => (
                  <div
                    key={c._id}
                    className="dropdown-item"
                    onClick={() => handleCommunityClick(c._id)}
                  >
                    r/{c.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div id="nav-right">
          <a href="/" className="logo">
            <i className="bi bi-chat-dots" />
          </a>
          <a href="/" className="logo">
            <i className="bi bi-plus-square" />
          </a>
          <a href="/" className="logo">
            <i className="bi bi-bell" />
          </a>


          <img id="userProfilePfp" src={`/pfps/${user?.avatar || 'gray.png'}`} alt="User avatar" />
        </div>
      </nav>
    </>
  );
}

export default Navbar;
