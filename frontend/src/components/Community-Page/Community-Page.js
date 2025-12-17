import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./Community-Page.css";
import Post from "../Post/Post";
import useDisplayPost from "../../hooks/useDisplayPost";
import CreatePost from "../CreatePost/CreatePost";

function CommunityPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const displayPost = useDisplayPost();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Fetch community data
    fetch(`/api/communities/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setCommunity(data);
        // Check if user is a member
        if (user && data.members) {
          const memberIds = data.members.map(m => 
            typeof m === 'object' ? m._id : m
          );
          setIsMember(memberIds.includes(user._id));
        }
      })
      .catch((err) => {
        setError("Failed to load community");
        console.error(err);
      });

    // Fetch community posts
    fetch(`/api/communities/${id}/posts`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch posts:", err);
        setIsLoading(false);
      });
  }, [id, user]);

  const handleJoinLeave = async () => {
    if (!user || !user._id) return;

    try {
      const endpoint = isMember ? "leave" : "join";
      const response = await fetch(`/api/communities/${id}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsMember(!isMember);
        // Refresh community data
        fetch(`/api/communities/${id}`)
          .then((res) => res.json())
          .then(setCommunity);
      }
    } catch (err) {
      console.error("Failed to join/leave community:", err);
    }
  };

  const handlePostCreated = (newPost) => {
    setShowCreatePost(false);
    // Add new post to the list
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    // Refresh community to update post count
    fetch(`/api/communities/${id}`)
      .then((res) => res.json())
      .then(setCommunity);
  };

  if (isLoading) {
    return <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>Loading...</div>;
  }

  if (error || !community) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
        <p>{error || "Community not found"}</p>
        <button onClick={() => navigate(-1)} style={{ marginTop: "20px", padding: "10px 20px" }}>
          Go Back
        </button>
      </div>
    );
  }

  const memberCount = community.members ? community.members.length : 0;
  const postCount = posts.length;

  return (
    <div className="community-page">
      <div className="community-header">
        <div className="community-info">
          {community.logo && (
            <img src={community.logo} alt={community.name} className="community-logo" />
          )}
          <div className="community-details">
            <h1>r/{community.name}</h1>
            {community.description && <p className="community-description">{community.description}</p>}
            <div className="community-stats">
              <span>{memberCount} {memberCount === 1 ? "member" : "members"}</span>
              <span>•</span>
              <span>{postCount} {postCount === 1 ? "post" : "posts"}</span>
            </div>
          </div>
        </div>
        <div className="community-actions">
          {user && (
            <>
              <button
                className={isMember ? "leave-btn" : "join-btn"}
                onClick={handleJoinLeave}
              >
                {isMember ? "Leave" : "Join"}
              </button>
              <button
                className="create-post-btn"
                onClick={() => setShowCreatePost(true)}
              >
                Create Post
              </button>
            </>
          )}
        </div>
      </div>

      <div className="community-posts">
        {posts.length === 0 ? (
          <div className="empty-community">
            <p>No posts yet in this community.</p>
            {user && isMember && (
              <button
                className="create-first-post-btn"
                onClick={() => setShowCreatePost(true)}
              >
                Create the first post
              </button>
            )}
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} style={{ marginBottom: "20px" }}>
              <Post
                post={post}
                user={post.user}
                community={post.community}
                onClick={() => displayPost(post._id)}
              />
              <div
                style={{
                  height: "1px",
                  width: "100%",
                  backgroundColor: "#3E4142",
                  marginTop: "15px",
                }}
              />
            </div>
          ))
        )}
      </div>

      {showCreatePost && (
        <CreatePost
          onClose={() => setShowCreatePost(false)}
          onPostCreated={handlePostCreated}
          defaultCommunity={id}
        />
      )}
    </div>
  );
}

export default CommunityPage;

