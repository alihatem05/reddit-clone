import React, { useState } from "react";
import "./Sidebar.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [showCommunities, setShowCommunities] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCommunities = () => setShowCommunities(!showCommunities);

  const communities = ["ReactJS", "Vite Lovers", "Frontend Devs", "Coding Memes"];

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
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
          <a>
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
          {communities.map((c, index) => (
            <a key={index} className="community-item">
              {c}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
