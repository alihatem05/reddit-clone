import "./Home-Page.css"
import Post from './../Post/Post'
import { useState, useEffect} from "react"
import useDisplayPost from "../../hooks/useDisplayPost";
import React from "react";

function HomePage() {
    const displayPost = useDisplayPost();

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch(`/api/posts`)
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
                        <div style={{ height: "1px", width: "90%", backgroundColor: "#3E4142",
                            marginTop: "15px", marginBottom: "15px", marginLeft: "30px"}}></div>
                    </>
                ))}
            </div>
        </div>
    );
}

export default HomePage;