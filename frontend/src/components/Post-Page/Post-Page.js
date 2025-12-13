import "./Post-Page.css";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

function PostPage({ }) {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    console.log("PostPage: fetching post id=", id);

    setError(null);
    fetch(`http://localhost:5005/api/posts/${id}`)
      .then(async (res) => {
        const text = await res.text();
        return JSON.parse(text);
      })
      .then((data) => {
        console.log("Post fetch data:", data);
        if (data) setPost(data);
      })
      .catch((err) => {
        console.error("Fetch post error:", err);
        setError(err.message || "Failed to fetch post");
      });
  }, [id]);

  const handleBackButton = (e) => {
    navigate("/")
  }

  if (!post) return <p style={{ marginTop: "1000px", color: "white" }}>Loading...</p>;

  const user = (typeof post.user === "object" ? post.user : null);
  const community = (typeof post.community === "object" ? post.community : null);

  return (
    <div id="postDetailedPage">
      <div id="postDetailed">
        <div id="upperSectionDetailed">
          <div id="postInfoDetailed">
            <i id="backButton" className="bi bi-arrow-left-circle" onClick={() => handleBackButton()}></i>
            {community?.logo && <img id="subLogoDetailed" src={community.logo} />}
            <div id="postInfoInnerDetailed">
              <div id="yarabD">
                <p id="subredditD">r/{community?.name || "Unknown"}</p>
                <p id="tagoD">{timeSince(post.createdAt)}</p>
              </div>
              <div id="accountInfoDet">
                <img id="userPfp" src={`/pfps/${user?.avatar || "gray.png"}`} />
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
            ></i>
            <p id="postVotesD">{post.votes}</p>
            <i
              id="downvoteD"
              className="arrow bi bi-arrow-down"
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
