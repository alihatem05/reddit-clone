import './Post.css'

function timeSince(dateString) {
  const now = new Date();
  const created = new Date(dateString);
  const seconds = Math.floor((now - created) / 1000);

  const intervals = [
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (let i = 0; i < intervals.length; i++) {
    const interval = Math.floor(seconds / intervals[i].seconds);
    if (interval >= 1) {
      return `${interval} ${intervals[i].label}${interval > 1 ? "s" : ""} ago`;
    }
  }
  return "few seconds ago";
}

function vote(post, up_or_down) {
  const action = up_or_down === "up" ? post.votes + 1
                 : up_or_down === "down" ? post.votes - 1
                 : post.votes;

  fetch(`http://localhost:5005/api/posts/${post._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ votes: action })
  })
    .then(res => res.json())
    .then(data => console.log("Updated:", data))
    .catch(err => console.error(err));
}

function Post({ post, user, community }) {
  return (
    <div className="singlePost">
        <div id="upperSection">
            <div id="postInfo">
                {community?.logo && <img id="subLogo" src={community.logo}/>}
                <div id="postInfoInner">
                    <div id="yarab">
                        <p id="subreddit">r/{community?.name || "Unknown"}</p>
                        <p id="tago">{timeSince(post.createdAt)}</p>
                    </div>
                    <p id="user">u/{user?.username || "Anonymous"}</p>
                </div>
            </div>
            <h3>{post.title}</h3>
        </div>
        <div id="middleSection">
            {post.image && <img id="postImg" src={post.image} />}
        </div>
        <div id="bottomSection">
            <div id="postVote">
                <i id="upvote" class="arrow bi bi-arrow-up" onClick={() => vote(post, "up")}></i>
                <p id="postVotes">{post.votes}</p>
                <i id="downvote" class="arrow bi bi-arrow-down" onClick={() => vote(post, "down")}></i>
            </div>
            <div id="commentPart">
                <i id="comments" class="bi bi-chat"></i>
                <p>{post.comments.length}</p>
            </div>
        </div>
    </div>
  );
}

export default Post;
