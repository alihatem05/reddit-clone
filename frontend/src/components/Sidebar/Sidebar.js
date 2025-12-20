import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import CreateCommunity from "../CreateCommunity/CreateCommunity";
import "./Sidebar.css";

export default function Sidebar() {
  const [showCommunities, setShowCommunities] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const toggleCommunities = () => setShowCommunities(!showCommunities);

  const handleCommunityClick = (communityId, e) => {
    e.stopPropagation();
    navigate(`/community/${communityId}`);
  };

  const handleCreateCommunity = () => {
    if (!user) return;
    setShowCreateCommunity(true);
  };

  const handleCommunityCreated = (newCommunity) => {
    setCommunities((prev) => [newCommunity, ...prev]);
    setShowCreateCommunity(false);
    window.dispatchEvent(new Event('communityCreated'));
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/communities`)
      .then((response) => response.json())
      .then((data) => {
        setCommunities(data);
      })
      .catch((err) => console.log("Error fetching communities:", err));
    
    const handleCommunityCreated = () => {
      fetch(`${process.env.REACT_APP_API_URL}/api/communities`)
        .then((response) => response.json())
        .then((data) => {
          setCommunities(data);
        })
        .catch((err) => console.log("Error fetching communities:", err));
    };
    
    window.addEventListener('communityCreated', handleCommunityCreated);
    
    return () => {
      window.removeEventListener('communityCreated', handleCommunityCreated);
    };
  }, []);

  return (
    <>
      <div id="sidebar">
        <div id="sideOptions">
          <a>
            <i className="bi bi-house-door-fill" />
            <p>Home</p>
          </a>
          <a>
            <i className="bi bi-graph-up-arrow" />
            <p>Popular</p>
          </a>
          <a>
            <i className="bi bi-browser-safari" />
            <p>Explore</p>
          </a>
          <a>
            <i className="bi bi-bounding-box-circles" />
            <p>All</p>
          </a>
          <a onClick={handleCreateCommunity} style={{ cursor: "pointer" }}>
            <i className="bi bi-bar-chart-line-fill" />
            <p>Start a Community</p>
          </a>
        </div>

        <a
          onClick={toggleCommunities}
          style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <p className="P1">COMMUNITIES</p>
          <i className={`bi bi-caret-down${showCommunities ? "-fill rotate" : ""}`}></i>
        </a>

        <div className={`communities-dropdown ${showCommunities ? "open" : ""}`}>
          {communities.length === 0 && <p>No communities yet.</p>}
                {communities.map((c) => (
                    <div 
                        key={c._id} 
                        className="communityItem"
                        onClick={(e) => handleCommunityClick(c._id, e)}
                        style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px" }}
                    >
                        {c.logo && (
                          <img 
                            src={c.logo} 
                            alt={c.name}
                            style={{ width: "20px", height: "20px", borderRadius: "50%", objectFit: "cover" }}
                          />
                        )}
                        <span>r/{c.name}</span>
                    </div>
                ))}
        </div>
      </div>
      {showCreateCommunity && (
        <CreateCommunity
          onClose={() => setShowCreateCommunity(false)}
          onCommunityCreated={handleCommunityCreated}
        />
      )}
    </>
  );
}
