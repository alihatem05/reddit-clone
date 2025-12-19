import './Post.css'
import useDisplayPost from '../../hooks/useDisplayPost'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'

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

function Post({ post, user, community, onClick, readOnly = false }) {
  const displayPost = useDisplayPost();
  const { user: currentUser } = useAuthContext();
  const navigate = useNavigate();
  const [localPost, setLocalPost] = useState(post);
  useEffect(() => setLocalPost(post), [post]);
  const handleClick = onClick || (() => displayPost(post._id));
  
  const handleCommunityClick = (e) => {
    e.stopPropagation();
    if (community?._id) {
      navigate(`/community/${community._id}`);
    }
  };
  const userInArray = (arr) => {
    if (!currentUser || !arr) return false;
    return arr.some(u => String(typeof u === 'object' ? u._id : u) === String(currentUser._id));
  }

  const handleVote = async (delta, e) => {
    e.stopPropagation();
    if (!currentUser) return;
    // determine whether we should remove vote (delta 0), switch, or add
    const hasUp = userInArray(localPost.upvoters);
    const hasDown = userInArray(localPost.downvoters);
    let outDelta = delta;
    if (delta === 1 && hasUp) outDelta = 0; // unvote
    if (delta === -1 && hasDown) outDelta = 0; // unvote

    // optimistic update
    setLocalPost(prev => {
      const cp = { ...prev };
      if (outDelta === 0) {
        if (hasUp) {
          cp.votes = cp.votes - 1;
          cp.upvoters = cp.upvoters.filter(u => String(typeof u === 'object' ? u._id : u) !== String(currentUser._id));
        } else if (hasDown) {
          cp.votes = cp.votes + 1;
          cp.downvoters = cp.downvoters.filter(u => String(typeof u === 'object' ? u._id : u) !== String(currentUser._id));
        }
      } else if (outDelta === 1) {
        if (hasDown) {
          cp.votes = cp.votes + 2; // switch
          cp.downvoters = cp.downvoters.filter(u => String(typeof u === 'object' ? u._id : u) !== String(currentUser._id));
        } else {
          cp.votes = cp.votes + 1;
        }
        cp.upvoters = [...(cp.upvoters || []), currentUser._id];
      } else if (outDelta === -1) {
        if (hasUp) {
          cp.votes = cp.votes - 2; // switch
          cp.upvoters = cp.upvoters.filter(u => String(typeof u === 'object' ? u._id : u) !== String(currentUser._id));
        } else {
          cp.votes = cp.votes - 1;
        }
        cp.downvoters = [...(cp.downvoters || []), currentUser._id];
      }
      return cp;
    });
    try {
      const res = await fetch(`/api/posts/${post._id}/vote`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta: outDelta, userId: currentUser._id }),
      });
      if (!res.ok) return;
      const updated = await res.json();
      // Optionally, if parent provides a callback, we could notify parent of changes
      setLocalPost(updated);
      // Dispatch event to notify profile page
      window.dispatchEvent(new CustomEvent('postVoted'));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="singlePost" onClick={handleClick} style={{ cursor: "pointer" }}>
        <div id="upperSection">
            <div id="postInfo">
                {community?.logo && (
                    <img 
                        id="subLogo" 
                        src={community.logo}
                        onClick={handleCommunityClick}
                        style={{ cursor: "pointer" }}
                        alt={community.name}
                    />
                )}
                <div id="postInfoInner">
                    <div id="yarab">
                        <p 
                            id="subreddit"
                            onClick={handleCommunityClick}
                            style={{ cursor: "pointer" }}
                        >
                            r/{community?.name || "Unknown"}
                        </p>
                        <p id="tago">{timeSince(post.createdAt)}</p>
                    </div>
                    <p id="user">u/{user?.username || "Anonymous"}</p>
                </div>
            </div>
            <h3>{post.title}</h3>
        </div>
        <div id="middleSection">
            {post.image && <img id="postImg" src={post.image} />}
            {post.description && <p id="postDescription">{post.description}</p>}
        </div>
        <div id="bottomSection">
          {!readOnly ? (
            <>
              <div id="postVote">
                <i id="upvote" className={`arrow bi bi-arrow-up ${userInArray(localPost?.upvoters) ? 'active' : ''}`} onClick={(e) => { handleVote(1, e) }} style={{ color: userInArray(localPost?.upvoters) ? '#f97316' : undefined }}></i>
                <p id="postVotes">{localPost?.votes}</p>
                <i id="downvote" className={`arrow bi bi-arrow-down ${userInArray(localPost?.downvoters) ? 'active' : ''}`} onClick={(e) => { handleVote(-1, e) }} style={{ color: userInArray(localPost?.downvoters) ? '#0ea5e9' : undefined }}></i>
              </div>
              <div id="commentPart">
                <i id="comments" className="bi bi-chat"></i>
                <p>{post.comments.length}</p>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <p id="postVotes">{post.votes} votes</p>
              <p>{post.comments.length} comments</p>
            </div>
          )}
        </div>
    </div>
  );
}

export default Post;
