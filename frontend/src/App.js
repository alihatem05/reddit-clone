import React, { useState, useEffect } from "react";
import { Navigate, BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import HomePage from "./components/Home-Page/Home-Page";
import PostPage from "./components/Post-Page/Post-Page";
import Login from "./components/Login/Login";
import Register from './components/Register/Register'
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5005/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5005/api/communities")
      .then((res) => res.json())
      .then((data) => setCommunities(data))
      .catch((err) => console.error("Error fetching communities:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5005/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <BrowserRouter>
    {isLoggedIn && (
        <>
          <Navbar />
          <Sidebar />
        </>
      )}
        <Routes>
            <Route path="/" element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;