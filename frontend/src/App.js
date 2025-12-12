import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import HomePage from "./components/Home-Page/Home-Page";
import PostPage from "./components/Post-Page/Post-Page";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";

import "./App.css";

function App() {
  const { user } = useAuthContext();  
  const isLoggedIn = !!user;

  return (
    <BrowserRouter>
      {isLoggedIn && (
        <>
          <Navbar />
          <Sidebar />
        </>
      )}

        <Routes>
            <Route
            path="/login"
            element={!isLoggedIn ? <Login /> : <Navigate to="/" />}
            />

            <Route
            path="/register"
            element={!isLoggedIn ? <Register /> : <Navigate to="/" />}
            />
        </Routes>

        <div id="mainPage">
            <Routes>
                <Route
                path="/"
                element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />}
                />

                <Route
                path="/post/:id"
                element={isLoggedIn ? <PostPage /> : <Navigate to="/login" />}
                />
            </Routes>
        </div>
    </BrowserRouter>
  );
}

export default App;
