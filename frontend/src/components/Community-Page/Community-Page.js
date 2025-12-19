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
  const { user: currentUser } = useAuthContext();
  const displayPost = useDisplayPost();
  
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    fetch(`/api/communities/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setCommunity(data);
        
        if (currentUser) {
          const memberIds = data.members?.map(m => 
            typeof m === 'object' ? m._id : m
          ) || [];
          const userCommunityIds = currentUser.communities?.map(c =>
            typeof c === 'object' ? c._id : c
          ) || [];
          setIsMember(
            memberIds.includes(currentUser._id) || 
            userCommunityIds.includes(data._id)
          );
        }
      })
      .catch((err) => {
        console.error("Error fetching community:", err);
        setError("Failed to load community");
        setIsLoading(false);
      });

    fetch(`/api/communities/${id}/posts`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setIsLoading(false);
      });
  }, [id, currentUser]);

  const handleJoinLeave = async () => {
    if (!currentUser || isJoining) return;
    
    setIsJoining(true);
    const endpoint = isMember 
      ? `/api/communities/${id}/leave`
      : `/api/communities/${id}/join`;
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser._id }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setIsMember(!isMember);
        
        if (data.community) {
          setCommunity(data.community);
        } else if (community) {
          setCommunity(prev => {
            const newMembers = isMember 
              ? prev.members.filter(m => {
                  const memberId = typeof m === 'object' ? m._id : m;
                  return String(memberId) !== String(currentUser._id);
                })
              : [...(prev.members || []), currentUser._id];
            
            return {
              ...prev,
              members: newMembers
            };
          });
        }
        
        if (data.user && data.user.communities) {
          const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
          if (storedUser && storedUser._id === currentUser._id) {
            storedUser.communities = data.user.communities;
            localStorage.setItem('user', JSON.stringify(storedUser));
          }
        }
      } else {
        console.error("Failed to join/leave community:", data.error || "Unknown error");
        alert(data.error || "Failed to " + (isMember ? "leave" : "join") + " community");
      }
    } catch (err) {
      console.error("Error joining/leaving community:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setShowCreatePost(false);
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    fetch(`/api/communities/${id}`)
      .then((res) => res.json())
      .then(setCommunity);
  };

  const handleDeleteCommunity = async () => {
    if (!currentUser || !community) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/communities/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser._id }),
      });

      const data = await response.json();
      
      if (response.ok) {
        navigate("/");
        window.dispatchEvent(new Event('communityCreated'));
      } else {
        alert(data.error || "Failed to delete community");
        setIsDeleting(false);
        setShowDeleteConfirm(false);
      }
    } catch (err) {
      console.error("Error deleting community:", err);
      alert("An error occurred while deleting the community");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const isCreator = currentUser && community && community.createdBy && 
    (typeof community.createdBy === 'object' 
      ? community.createdBy._id.toString() === currentUser._id.toString()
      : community.createdBy.toString() === currentUser._id.toString());

  if (isLoading) {
    return (
      <div id="communityPage">
        <p style={{ color: "white", marginTop: "100px" }}>Loading...</p>
      </div>
    );
  }

  if (error || !community) {
    return (
      <div id="communityPage">
        <p style={{ color: "white", marginTop: "100px" }}>
          {error || "Community not found"}
        </p>
        <button onClick={() => navigate(-1)} style={{ marginTop: "20px", padding: "10px 20px" }}>
          Go Back
        </button>
      </div>
    );
  }

  const memberCount = community.members?.length || 0;

  return (
    <div id="communityPage">
      <div id="communityBanner"></div>

      <div id="communityHeaderCard">
        <div id="communityHeaderContent">
          {community.logo && (
            <img id="communityLogo" src={community.logo} alt={community.name} />
          )}
          <div id="communityHeaderInfo">
            <div id="communityHeaderTop">
              <h1 id="communityName">r/{community.name}</h1>
            </div>
          </div>
        </div>
      </div>

      <div id="communityContent">
        <div id="communityMain">
          <div id="postsSection">
            {posts.length === 0 ? (
              <div id="noPosts">
                <p>No posts in this community yet.</p>
                <p style={{ color: "#7a7a7a", fontSize: "14px", marginTop: "10px" }}>
                  Be the first to post!
                </p>
                {currentUser && isMember && (
                  <button
                    className="create-first-post-btn"
                    onClick={() => setShowCreatePost(true)}
                    style={{ marginTop: "20px", padding: "12px 24px", borderRadius: "24px", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer", backgroundColor: "#D93900", color: "#e6e6e6" }}
                  >
                    Create the first post
                  </button>
                )}
              </div>
            ) : (
              posts.map((p) => (
                <Post
                  key={p._id}
                  user={p.user}
                  community={p.community}
                  post={p}
                  onClick={() => displayPost(p._id)}
                />
              ))
            )}
          </div>
        </div>

        <div id="communitySidebar">
          <div id="sidebarCard">
            <div id="sidebarHeader">
              <h2>About Community</h2>
            </div>
            <div id="sidebarContent">
              <div id="memberCount">
                <div id="memberCountTop">
                  <span id="memberNumber">{memberCount}</span>
                  <span id="memberLabel">Members</span>
                </div>
              </div>
              {community.description && (
                <div id="sidebarDescription">
                  <p>{community.description}</p>
                </div>
              )}
              <div id="sidebarActions">
                {!isCreator && (
                  <button 
                    id="joinLeaveButton"
                    className={isMember ? "leave" : "join"}
                    onClick={handleJoinLeave}
                    disabled={isJoining || !currentUser}
                  >
                    {isJoining ? "Loading..." : (isMember ? "Joined" : "Join")}
                  </button>
                )}
                {currentUser && (
                  <button
                    className="create-post-btn"
                    onClick={() => setShowCreatePost(true)}
                    style={{ width: "100%", marginTop: "12px", padding: "8px 16px", fontSize: "14px", fontWeight: "700", borderRadius: "9999px", border: "none", cursor: "pointer", backgroundColor: "#D93900", color: "#e6e6e6", transition: "background-color 0.2s" }}
                  >
                    Create Post
                  </button>
                )}
                {isCreator && (
                  <button
                    className="delete-community-btn"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isDeleting}
                    style={{ width: "100%", marginTop: "12px", padding: "8px 16px", fontSize: "14px", fontWeight: "700", borderRadius: "9999px", border: "1px solid #ff4444", cursor: "pointer", backgroundColor: "transparent", color: "#ff4444", transition: "all 0.2s" }}
                  >
                    {isDeleting ? "Deleting..." : "Delete Community"}
                  </button>
                )}
              </div>
              <div id="communityCreated">
                <p>Created {new Date(community.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCreatePost && (
        <CreatePost
          onClose={() => setShowCreatePost(false)}
          onPostCreated={handlePostCreated}
          defaultCommunity={id}
        />
      )}

      {showDeleteConfirm && (
        <div className="delete-confirm-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Community</h3>
            <p>Are you sure you want to delete this community? This action cannot be undone. All posts in this community will be deleted.</p>
            <div className="delete-confirm-actions">
              <button
                className="cancel-delete-btn"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="confirm-delete-btn"
                onClick={handleDeleteCommunity}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommunityPage;
