import "./App.css"
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import HomePage from "./components/Home-Page/Home-Page"
import Post from "./components/Post/Post"
import { posts } from './data/posts'

function App() {
  return (
    <div>
        <Navbar />
        <div id="mainPage">
            <Sidebar />
            <HomePage />
        </div>
    </div>
  );
}

export default App;