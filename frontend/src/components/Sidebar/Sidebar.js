import React, { useState, useEffect } from "react";
import "./Sidebar.css";

export default function Sidebar() {
  const [showCommunities, setShowCommunities] = useState(false);
  const [communities, setCommunities] = useState([]);

  const toggleCommunities = () => setShowCommunities(!showCommunities);

  useEffect(() => {
    fetch("http://localhost:5005/api/communities")
      .then((response) => response.json())
      .then((data) => {
        setCommunities(data);
      })
      .catch((err) => console.log("Error fetching communities:", err));
    }, []);

  return (
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
          {communities.length === 0 && <p>No communities yet.</p>}
                {communities.map((c) => (
                    <>
                        <a key={c._id} className="communityItem">r/{c.name}</a>
                    </>
                ))}
        </div>
      </div>
  );
}
