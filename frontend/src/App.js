import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import HomePage from "./components/Home-Page/Home-Page"
import "./App.css"

function App() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [communities, setCommunities] = useState([]);

    useEffect(() => {
    fetch("http://localhost:5005/api/posts")
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((err) => console.log("Error fetching posts:", err));
    }, []);

    useEffect(() => {
    fetch("http://localhost:5005/api/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => console.log("Error fetching users:", err));
    }, []);

    useEffect(() => {
    fetch("http://localhost:5005/api/communities")
      .then((response) => response.json())
      .then((data) => {
        setCommunities(data);
      })
      .catch((err) => console.log("Error fetching communities:", err));
    }, []);

  return (
    <div>
        <Navbar />
        <Sidebar communities={ communities }/>
        <div id="mainPage">
            <HomePage posts={ posts }/>
        </div>
    </div>
  );
}

export default App;