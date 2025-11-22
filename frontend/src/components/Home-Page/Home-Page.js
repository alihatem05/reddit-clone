import "./Home-Page.css"
import Post from './../Post/Post'
import { posts } from './../../data/posts'

function HomePage() {
    return (
        <div id="homePage">
            <div id="postsSection">
                {posts.map(post => (
                    <Post key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}

export default HomePage;