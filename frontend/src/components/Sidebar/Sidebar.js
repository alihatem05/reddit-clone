// Sidebar.js
import React, { useState } from "react";
import "./Sidebar.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <i class="bi bi-justify" onClick={toggleSidebar}/>
      {isOpen && (
        <div id="sidebar">
          <a>
            <i class="bi bi-house-door-fill" />
            <p>Home</p>
          </a>
          <a>
            <i class="bi bi-graph-up-arrow" />
            <p>Popular</p>
          </a>
          <a>
            <i class="bi bi-bounding-box-circles" />
            <p>All</p>
          </a>
          <a>
            <i class="bi bi-browser-safari" />
            <p>Explore</p>
          </a>
          <a>
            <i class="bi bi-bar-chart-line-fill" />
            <p>Create a Community</p>
          </a>
        </div>
      )}
    </div>
  );
}
