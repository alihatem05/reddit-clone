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
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  const appendReplyToComment = (commentsArray, parentId, newComment) => {
    return commentsArray.map(c => {
      if (String(c._id) === String(parentId)) {
        const replies = c.replies ? [...c.replies, newComment] : [newComment];
        return { ...c, replies };
      }
      if (c.replies && c.replies.length > 0) {
        return { ...c, replies: appendReplyToComment(c.replies, parentId, newComment) };
      }
      return c;
    });
  };

  const removeCommentFromTree = (commentsArray, idToRemove) => {
    return commentsArray.filter(c => String(c._id) !== String(idToRemove)).map(c => {
      if (c.replies && c.replies.length) {
        return { ...c, replies: removeCommentFromTree(c.replies, idToRemove) };
      }
      return c;
    });
  };

  const handleDeleteComment = async (commentId) => {
    if (!currentUser?._id) return;
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser._id }),
      });
      if (!res.ok) return;
      setPost(prev => ({ ...prev, comments: removeCommentFromTree(prev.comments || [], commentId) }));
    } catch (err) {
      console.error(err);
    }
  };

  const userInArray = (arr) => {
    if (!currentUser || !arr) return false;
    return arr.some(u => String(typeof u === 'object' ? u._id : u) === String(currentUser._id));
  };

  const handlePostComment = async ({ text, parentId = null }) => {
    if (!text || !text.trim()) return null;
    setIsSubmittingComment(true);
    try {
      const response = await fetch(`/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, user: currentUser?._id || null, post: post._id, parent: parentId }),
      });
      const json = await response.json();
      if (!response.ok) {
        console.error('Failed to submit comment', json);
        return null;
      }
      if (parentId) {
        setPost(prev => ({ ...prev, comments: appendReplyToComment(prev.comments || [], parentId, json) }));
      } else {
        setPost(prev => ({ ...prev, comments: [...(prev.comments || []), json] }));
      }
      return json;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleVoteComment = async (commentId, delta) => {
    try {
      const res = await fetch(`/api/comments/${commentId}/vote`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta, userId: currentUser?._id || null }),
      });
      const updated = await res.json();
      if (!res.ok) return;
      const replaceComment = (commentsArray) => {
        return commentsArray.map(c => {
          if (String(c._id) === String(commentId)) {
            // return the updated object; ensure replies field is present
            return { ...c, ...updated };
          }
          if (c.replies && c.replies.length) {
            return { ...c, replies: replaceComment(c.replies) };
          }
          return c;
        });
      };
      setPost(prev => ({ ...prev, comments: replaceComment(prev.comments || []) }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleVotePost = async (delta) => {
    const hasUp = userInArray(post.upvoters);
    const hasDown = userInArray(post.downvoters);
    let outDelta = delta;
    if (delta === 1 && hasUp) outDelta = 0;
    if (delta === -1 && hasDown) outDelta = 0;
    // optimistic update
    setPost(prev => {
      const p = { ...prev };
      if (outDelta === 0) {
        if (hasUp) {
          p.votes -= 1;
          p.upvoters = p.upvoters.filter(u => String(typeof u === 'object' ? u._id : u) !== String(currentUser._id));
        } else if (hasDown) {
          p.votes += 1;
          p.downvoters = p.downvoters.filter(u => String(typeof u === 'object' ? u._id : u) !== String(currentUser._id));
        }
      } else if (outDelta === 1) {
        if (hasDown) {
          p.votes += 2; // switch
          p.downvoters = p.downvoters.filter(u => String(typeof u === 'object' ? u._id : u) !== String(currentUser._id));
        } else {
          p.votes += 1;
        }
        p.upvoters = [...(p.upvoters || []), currentUser._id];
      } else if (outDelta === -1) {
        if (hasUp) {
          p.votes -= 2; // switch
          p.upvoters = p.upvoters.filter(u => String(typeof u === 'object' ? u._id : u) !== String(currentUser._id));
        } else {
          p.votes -= 1;
        }
        p.downvoters = [...(p.downvoters || []), currentUser._id];
      }
      return p;
    });
    try {
      const res = await fetch(`/api/posts/${post._id}/vote`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta: outDelta, userId: currentUser?._id || null }),
      });
      const updated = await res.json();
      if (!res.ok) return;
      setPost(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async () => {
    if (!currentUser?._id) return;
    try {
      const res = await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser._id }),
      });
      if (!res.ok) {
        console.error('Failed to delete post');
        return;
      }
      navigate(-1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommenting = async () => {
    if (!commentText.trim()) return;
      await handlePostComment({ text: commentText, parentId: null });
      setCommentText('');
  }

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

  const handleCommunityClick = (e) => {
    e.stopPropagation();
    if (post.community) {
      const communityId = typeof post.community === "object" ? post.community._id : post.community;
      navigate(`/community/${communityId}`);
    }
  };

  if (!post) return <p style={{ marginTop: "1000px", color: "white" }}>Loading...</p>;

  const user = (typeof post.user === "object" ? post.user : null);
  const community = (typeof post.community === "object" ? post.community : null);

  return (
    <div id="postDetailedPage">
      <div id="postDetailed">
        <div id="upperSectionDetailed">
          <div id="postInfoDetailed">
            <i id="backButton" className="bi bi-arrow-left-circle" onClick={() => handleBackButton()}></i>
            {community?.logo && (
              <img 
                id="subLogoDetailed" 
                src={community.logo}
                onClick={handleCommunityClick}
                style={{ cursor: "pointer" }}
                alt={community.name}
              />
            )}
            <div id="postInfoInnerDetailed">
              <div id="yarabD">
                <p 
                  id="subredditD"
                  onClick={handleCommunityClick}
                  style={{ cursor: "pointer" }}
                >
                  r/{community?.name || "Unknown"}
                </p>
                <p id="tagoD">{timeSince(post.createdAt)}</p>
              </div>
              <div id="accountInfoDet">
                <img id="userPfp" src={`/pfps/${user?.avatar || "gray.png"}`} />
                <p id="userD">u/{user?.username || "Anonymous"}</p>
              </div>
            </div>
            {currentUser?._id === user?._id && (
              <i id="trashcan" className="bi bi-trash3" onClick={() => handleDeletePost()} ></i>
            )}
          </div>
            <h2>{post.title}</h2>
        </div>

          <div id="middleSectionDetailed">
            {post.image && <img id="postImgD" src={post.image} />}
            <p>{post.description || <span className="no-description">No Description</span>}</p>
          </div>

          <div id="bottomSectionDetailed">
            <div id="postVoteD">
              <i id="upvoteD" className={`arrow bi bi-arrow-up ${userInArray(post.upvoters) ? 'active' : ''}`} onClick={() => { if (currentUser) handleVotePost(1); }} style={{ color: userInArray(post.upvoters) ? '#f97316' : undefined }}></i>
              <p id="postVotesD">{post.votes}</p>
              <i id="downvoteD" className={`arrow bi bi-arrow-down ${userInArray(post.downvoters) ? 'active' : ''}`} onClick={() => { if (currentUser) handleVotePost(-1); }} style={{ color: userInArray(post.downvoters) ? '#0ea5e9' : undefined }}></i>
            </div>
            <div id="commentPartD">
              <i id="commentsD" className="bi bi-chat"></i>
              <p>{post.comments.length}</p>
            </div>
          </div>

      <div style={{height: "1px", width: "100%", backgroundColor: "#3E4142", marginTop: "15px", marginBottom: "15px"}}></div>

      <div id="commentsSection">
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', width: '100%', marginBottom: 12 }}>
          <img src={`/pfps/${currentUser?.avatar || 'gray.png'}`} alt="avatar" style={{ width: 34, height: 34, borderRadius: 20 }} />
          <div style={{ flex: 1 }}>
            <textarea id="commentinput" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a comment" rows={2}/>
            <div id="postcommentsector">
              <button id="postthecomment" onClick={() => handleCommenting()}>Post Comment</button>
            </div>
          </div>
        </div>

        {post.comments && post.comments.length > 0 ? ( post.comments.map((c) => (
          <Comment key={c._id} comment={c} onReply={handlePostComment} onVote={handleVoteComment} onDelete={handleDeleteComment} />
        ))) : (
          <div id="nocomments">
            <p id="pp">No comments yet.</p>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}

export default PostPage;
