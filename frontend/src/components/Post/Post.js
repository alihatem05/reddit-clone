import './Post.css'
import useDisplayPost from '../../hooks/useDisplayPost'
import { useVote } from '../../hooks/useVote'
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
  const navigate = useNavigate();
  const [localPost, setLocalPost] = useState(post);
  useEffect(() => setLocalPost(post), [post]);
  const handleClick = onClick || (() => displayPost(post._id));
  
  const { handleVote, hasUpvoted, hasDownvoted } = useVote(localPost, setLocalPost, 'post');
  
  const handleCommunityClick = (e) => {
    e.stopPropagation();
    if (community?._id) {
      navigate(`/community/${community._id}`);
    }
  };

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
        </div>
        <div id="bottomSection">
          {!readOnly ? (
            <>
              <div id="postVote">
                <i id="upvote" className={`arrow bi bi-arrow-up ${hasUpvoted ? 'active' : ''}`} onClick={(e) => { handleVote(1, e) }} style={{ color: hasUpvoted ? '#f97316' : undefined }}></i>
                <p id="postVotes">{localPost?.votes}</p>
                <i id="downvote" className={`arrow bi bi-arrow-down ${hasDownvoted ? 'active' : ''}`} onClick={(e) => { handleVote(-1, e) }} style={{ color: hasDownvoted ? '#0ea5e9' : undefined }}></i>
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
