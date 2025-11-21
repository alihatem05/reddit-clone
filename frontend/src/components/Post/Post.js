import './Post.css'

function Post({ post }) {
  return (
    <div className="singlePost">
        <div id="upperSection">
            <div id="postInfo">
                {post.subredditLogo && <img id="subLogo" src={post.subredditLogo}/>}
                <div id="postInfoInner">
                    <p id="subreddit">r/{post.subreddit}</p>
                    <p id="user">u/{post.username}</p>
                </div>
                <p>- {post.timeAgo} ago</p>
            </div>
            <h2>{post.title}</h2>
        </div>
        <div id="middleSection">
            {post.postImage && <img id="postImg" src={post.postImage} />}
        </div>
        <div id="bottomSection">

        </div>
    </div>
  );
}

export default Post;