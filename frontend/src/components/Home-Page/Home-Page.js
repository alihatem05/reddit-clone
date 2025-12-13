import "./Home-Page.css"
import Post from './../Post/Post'
import { useState, useEffect} from "react"
// navigation handled by useDisplayPost
import useDisplayPost from "../../hooks/useDisplayPost";
import React from "react";

function HomePage() {
    const displayPost = useDisplayPost();

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5005/api/posts")
        .then((res) => res.json())
        .then(setPosts)
        .catch(console.log);
    }, []);

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
                        onClick={() => displayPost(p._id)}
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