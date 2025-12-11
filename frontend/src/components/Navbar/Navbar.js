import React, { useState } from "react";
import "./Navbar.css";
import reddit_logo_path from "./../../assets/Reddit-Logo.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav aria-label="Primary navigation" id="navbar">
        <div id="nav-left">
          <a href="/" id="reddit-logo">
            <img src={reddit_logo_path} alt="RedditClone logo" width="115" height="32" />
          </a>

          <div id="searchbar-nav" role="search">
            <input id="searchBar" type="search" placeholder="Search Reddit" />
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

          <button onClick={() => setMenuOpen(true)}>Log in</button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
