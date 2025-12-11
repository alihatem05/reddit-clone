import "./Home-Page.css"
import Post from './../Post/Post'
import { useState, useEffect} from "react"
import React from "react";

function HomePage({ posts }) {

    return (
        <div id="homePage">
            <div id="postsSection">
                {posts.length === 0 && <p>No posts yet.</p>}
                {posts.map((p) => (
                    <>
                        <Post
                        key={p._id}
                        user={p.user}
                        community={p.community}
                        post={p}
                        />
                        <div style={{ height: "1px", width: "100%", backgroundColor: "#3E4142",
                            marginTop: "15px", marginBottom: "15px"}}></div>
                    </>
                ))}
            </div>
        </div>
    );
}

export default HomePage;