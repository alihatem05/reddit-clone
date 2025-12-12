import "./Post-Page.css";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

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

function vote(post, up_or_down, setPost) {
  const action =
    up_or_down === "up" ? post.votes + 1 : up_or_down === "down" ? post.votes - 1 : post.votes;

  fetch(`http://localhost:5005/api/posts/${post._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ votes: action }),
  })
    .then((res) => res.json())
    .then((updatedPost) => setPost(updatedPost))
    .catch((err) => console.error(err));
}

function PostPage({ posts = [], users = [], communities = [] }) {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const foundPost = posts.find((p) => p._id === id);
    if (foundPost) {
      setPost(foundPost);
    }
  }, [id, posts]);

  if (!post) return <p>Loading...</p>;

  const user = (typeof post.user === "object" ? post.user : null);
  const community = (typeof post.community === "object" ? post.community : null);

  return (
    <div id="postDetailedPage">
      <div id="postDetailed">
        <div id="upperSectionDetailed">
          <div id="postInfoDetailed">
            {community?.logo && <img id="subLogoDetailed" src={community.logo} />}
            <div id="postInfoInnerDetailed">
              <div id="yarabD">
                <p id="subredditD">r/{community?.name || "Unknown"}</p>
                <p id="tagoD">{timeSince(post.createdAt)}</p>
              </div>
              <div id="accountInfoDet">
                <img id="userPfp" src={`/pfps/${user?.avatar || "default.png"}`} />
                <p id="userD">u/{user?.username || "Anonymous"}</p>
              </div>
            </div>
          </div>

          <h2>{post.title}</h2>
        </div>

        <div id="middleSectionDetailed">
          {post.image && <img id="postImgD" src={post.image} />}
          <p>{post.description || "No Description"}</p>
        </div>

        <div id="bottomSectionDetailed">
          <div id="postVoteD">
            <i
              id="upvoteD"
              className="arrow bi bi-arrow-up"
              onClick={() => vote(post, "up", setPost)}
            ></i>
            <p id="postVotesD">{post.votes}</p>
            <i
              id="downvoteD"
              className="arrow bi bi-arrow-down"
              onClick={() => vote(post, "down", setPost)}
            ></i>
          </div>
          <div id="commentPartD">
            <i id="commentsD" className="bi bi-chat"></i>
            <p>{post.comments.length}</p>
          </div>
        </div>
      </div>

      <div
        style={{
          height: "1px",
          width: "90%",
          backgroundColor: "#3E4142",
          marginTop: "15px",
          marginBottom: "15px",
        }}
      ></div>

      <div id="commentsSection"></div>
    </div>
  );
}

export default PostPage;
