import "./Home-Page.css"
import Post from './../Post/Post'
import { posts } from './../../data/posts'
import React from "react";

function HomePage() {
    return (
        <div id="homePage">
            <div id="postsSection">
                {posts.map(post => (
                    <React.Fragment key={post.id}>
                        <Post post={post} />
                            <div style={{height: "1px", width: "100%", backgroundColor: " #3E4142", marginTop: "15px", marginBottom: "15px"}}></div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

export default HomePage;