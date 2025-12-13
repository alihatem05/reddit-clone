import "./Post-Page.css";
import React, { useState, useEffect } from "react";
import { useAuthContext } from '../../hooks/useAuthContext';
import { useParams, useNavigate } from "react-router-dom";
import Comment from '../Comment/Comment';

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
  const { user: currentUser } = useAuthContext();
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    if (!id) return;
    console.log("PostPage: fetching post id=", id);

    setError(null);
    fetch(`/api/posts/${id}`)
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
    navigate(-1)
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
          {post.description ? (
            <p>{post.description}</p>
          ) : (
            <p className="no-description">No Description</p>
          )}
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

      <div id="commentsSection">
        <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", marginBottom: '12px' }}>
          <button
            className="create-post-btn"
            onClick={() => setIsCommentModalOpen(true)}
          >
            Add a Comment
          </button>
        </div>
        {post.comments && post.comments.length > 0 ? (
          post.comments.map((c) => (
            <Comment key={c._id} comment={c} />
          ))
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <p style={{ color: '#8f9496', marginTop: '10px' }}>No comments yet.</p>
          </div>
        )}
        {isCommentModalOpen && (
          <div className="modal-overlay">
            <div className="comment-modal">
              <h3 style={{ margin: 0 }}>Add a comment</h3>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={4}
                style={{ width: '100%', marginTop: 10, padding: 8, background: '#0f1314', color: '#fff', border: '1px solid #3e4142' }}
                placeholder="Add your comment..."
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12, gap: 8 }}>
                <button className="tab-arrow" onClick={() => { setIsCommentModalOpen(false); setCommentText(""); }}>Cancel</button>
                <button
                  className="create-post-btn"
                  onClick={async () => {
                    if (!commentText.trim()) return;
                    setIsSubmittingComment(true);
                    try {
                      const response = await fetch(`/api/comments`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ text: commentText, user: currentUser?._id || null, post: post._id }),
                      });
                      const json = await response.json();
                      if (!response.ok) {
                        console.error('Failed to submit comment', json);
                        setIsSubmittingComment(false);
                        return;
                      }
                      // add comment to the list
                      setPost((prev) => ({ ...prev, comments: [...(prev.comments || []), json] }));
                      setIsCommentModalOpen(false);
                      setCommentText("");
                    } catch (err) {
                      console.error(err);
                    } finally {
                      setIsSubmittingComment(false);
                    }
                  }}
                >
                  {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostPage;
