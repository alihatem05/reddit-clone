import './Post.css'

function Post({ post }) {
  return (
    <div className="singlePost">
        <div id="upperSection">
            <div id="postInfo">
                {post.subredditLogo && <img id="subLogo" src={post.subredditLogo}/>}
                <div id="postInfoInner">
                    <div id="yarab">
                        <p id="subreddit">r/{post.subreddit}</p>
                        <p id="tago">{post.timeAgo} ago</p>
                    </div>
                    <p id="user">u/{post.username}</p>
                </div>
            </div>
            <h3>{post.title}</h3>
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