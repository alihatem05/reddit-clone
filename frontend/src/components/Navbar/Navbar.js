import React, { useState } from "react";
import "./Navbar.css";
import reddit_logo_path from "./../../assets/Reddit-Logo.png";
import notification_logo_path from "./../../assets/bell.svg";
import create_post_logo_path from "./../../assets/plus-square.svg";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav aria-label="Primary navigation" id="navbar">
      <div id="nav-left">
        <a href="/" id="reddit-logo">
          <img src={reddit_logo_path} alt="RedditClone logo" width="115" height="32" />
        </a>

        <div id="searchbar-nav" role="search">
          <input id="searchBar" type="search" placeholder="Search Reddit"/>
        </div>
      </div>

      <div id="nav-right">
        <a href="/" className="logo">
          <i class="bi bi-chat-dots"/>
        </a>
        <a href="/" className="logo">
          <i class="bi bi-plus-square" />
        </a>
        <a href="/" className="logo">
          <i class="bi bi-bell" />
        </a>
        <button>Log in</button>
      </div>
    </nav>
  );
}

export default Navbar;
