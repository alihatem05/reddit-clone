import "./Home-Page.css"
import Post from './../Post/Post'
import { posts } from './../../data/posts'

function HomePage() {
    return (
        <div id="homePage">
            {posts.map(post => (
                <Post key={post.id} post={post} />
            ))}
        </div>
    );
}

export default HomePage;