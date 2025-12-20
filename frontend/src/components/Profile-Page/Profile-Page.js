import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./Profile-Page.css";
import useDisplayPost from '../../hooks/useDisplayPost';
import Post from '../Post/Post';
import EditProfileModal from './EditProfileModal';
import CreatePost from '../CreatePost/CreatePost';
import Comment from '../Comment/Comment';

const tabs = ["Posts", "Comments", "Upvoted", "Downvoted"];

const EmptyState = ({ title }) => (
  <div className="empty-state">
    <div className="overview-snoo-container">
      <img
        src="https://www.redditstatic.com/shreddit/assets/snoomojis/Snoo_Expression_NoMouth.png"
        alt="Snoo"
        width="128"
        loading="lazy"
      />
    </div>
    <div className="no-posts-container">
      <div className="no-posts-message">
        <div className="no-posts-title">{title}</div>
      </div>
    </div>
  </div>
);

const ProfilePage = () => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState("Posts");
  const tabsRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [upvotedPosts, setUpvotedPosts] = useState([]);
  const [downvotedPosts, setDownvotedPosts] = useState([]);
  const [upvotedComments, setUpvotedComments] = useState([]);
  const [downvotedComments, setDownvotedComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const displayPost = useDisplayPost();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const fetchUserData = useCallback(() => {
    if (!user || !user._id) return;
    setIsLoading(true);
    
    fetch(`${process.env.REACT_APP_API_URL}/api/users/${user._id}`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
        setComments(data.comments || []);
        setUpvotedPosts(data.upvotedPosts || []);
        setDownvotedPosts(data.downvotedPosts || []);
        setUpvotedComments(data.upvotedComments || []);
        setDownvotedComments(data.downvotedComments || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setIsLoading(false);
      });
  }, [user]);

  useEffect(() => {
    fetchUserData();
    
    const handleVoteEvent = () => {
      fetchUserData();
    };
    
    const handleCommentCreated = () => {
      fetchUserData();
    };
    
    window.addEventListener('postVoted', handleVoteEvent);
    window.addEventListener('commentVoted', handleVoteEvent);
    window.addEventListener('commentCreated', handleCommentCreated);
    
    return () => {
      window.removeEventListener('postVoted', handleVoteEvent);
      window.removeEventListener('commentVoted', handleVoteEvent);
      window.removeEventListener('commentCreated', handleCommentCreated);
    };
  }, [user, fetchUserData]);

  if (!user) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading user data...</p>;
  }

  const avatar = user.avatar || "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png";
  const username = user.username || "Unknown";

  const scrollTabs = (direction) => {
    if (tabsRef.current) {
      const scrollAmount = 150;
      tabsRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const emptyMessages = {
    Posts: `You don't have any posts yet`,
    Comments: "You don't have any comments yet",
    Upvoted: "You haven't upvoted anything yet",
    Downvoted: "You haven't downvoted anything yet",
  };

  return (
    <div className="profile-page">
      <div className="profile-main-container">
        <div className="profile-main">
          <div className="profile-header">
            <div className="avatar-container">
              <img 
                src={user?.avatar?.startsWith('data:image/') ? user.avatar : `/pfps/${user?.avatar || 'gray.png'}`} 
                alt={`${username} avatar`} 
                className="profile-avatar" 
              />
              <button 
                className="edit-avatar-btn" 
                aria-label="Edit profile avatar"
                onClick={() => setIsEditModalOpen(true)}
              >
                ✎
              </button>
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{username}</h1>
              <p className="profile-username">u/{username}</p>
            </div>
           
          </div>
					<div className="profile-summary-row">
            <div className="stat-list">
              <div className="stat-item">
                <p className="stat-title">Email</p>
                <p className="stat-value">{user.email}</p>
              </div>
              <div className="stat-item">
                <p className="stat-title">Karma</p>
                <p className="stat-value">{user.karma || 0}</p>
              </div>
              <div className="stat-item">
                <p className="stat-title">Posts</p>
                <p className="stat-value">{posts.length}</p>
              </div>
            </div>
          </div>
          <div className="tabs-container">
            <button 
              className="tab-arrow" 
              onClick={() => scrollTabs("left")}
              aria-label="Scroll tabs left"
            >
              ‹
            </button>
            <div className="profile-tabs" role="tablist" ref={tabsRef}>
              {tabs.map((tab) => (
                <span
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  className={activeTab === tab ? "active-tab" : ""}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </span>
              ))}
            </div>
            <button 
              className="tab-arrow" 
              onClick={() => scrollTabs("right")}
              aria-label="Scroll tabs right"
            >
              ›
            </button>
          </div>
					<div style={{ height: "1px", width: "100%", backgroundColor: "#3E4142", marginTop: "15px", marginBottom: "15px"}}></div>
          <div className="tab-content">
            {activeTab === "Posts" && (
              <div className="tab-section">
                <button className="postButtonProf" onClick={() => setShowCreatePost(true)}>Create Post</button>
                {posts.length === 0 ? (
                  <EmptyState title={emptyMessages.Posts} />
                ) : (
                  <div className="user-posts-list">
                    {posts.map((p) => (
                      <div key={p._id} style={{ marginBottom: '12px' }}>
                        <Post post={p} user={p.user} community={p.community} readOnly={true} onClick={() => displayPost(p._id)} />
                        <div style={{ height: "1px", width: "590px", backgroundColor: "#3E4142", marginTop: "15px", marginBottom: "15px"}} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "Comments" && (
              <div className="tab-section">
                {isLoading ? (
                  <p style={{ color: "white", textAlign: "center", marginTop: "50px" }}>Loading comments...</p>
                ) : !Array.isArray(comments) || comments.length === 0 ? (
                  <EmptyState title={emptyMessages.Comments} />
                ) : (
                  <div className="user-comments-list">
                    {comments
                      .filter(comment => comment && comment._id)
                      .map((comment) => {
                        if (!comment || !comment._id) return null;
                        const postId = typeof comment.post === 'object' ? comment.post?._id : comment.post;
                        const postTitle = typeof comment.post === 'object' ? comment.post?.title : null;
                        return (
                          <div key={comment._id} className="profile-comment-item" style={{ marginBottom: '12px' }}>
                            <div className="profile-comment-header">
                              <span 
                                className="profile-comment-post-title" 
                                onClick={() => postId && displayPost(postId)}
                                style={{ cursor: postId ? 'pointer' : 'default', color: '#D93900', fontWeight: '600' }}
                              >
                                {postTitle || "Post deleted"}
                              </span>
                              <span className="profile-comment-time" style={{ color: '#888', fontSize: '12px' }}>
                                {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}
                              </span>
                            </div>
                            <Comment 
                              comment={comment} 
                              onReply={() => {}} 
                              onVote={() => {
                                fetchUserData();
                              }} 
                              onDelete={() => {
                                fetchUserData();
                              }} 
                            />
                            <div style={{ height: "1px", width: "100%", backgroundColor: "#3E4142", marginTop: "15px", marginBottom: "15px"}} />
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "Upvoted" && (
              <div className="tab-section">
                {isLoading ? (
                  <p style={{ color: "white", textAlign: "center", marginTop: "50px" }}>Loading...</p>
                ) : (upvotedPosts.length === 0 && upvotedComments.length === 0) ? (
                  <EmptyState title={emptyMessages.Upvoted} />
                ) : (
                  <div className="user-posts-list">
                    {upvotedPosts.map((p) => (
                      <div key={`post-${p._id}`} style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>POST</div>
                        <Post post={p} user={p.user} community={p.community} readOnly={true} onClick={() => displayPost(p._id)} />
                        <div style={{ height: "1px", width: "590px", backgroundColor: "#3E4142", marginTop: "15px", marginBottom: "15px"}} />
                      </div>
                    ))}
                    {upvotedComments
                      .filter(comment => comment && comment._id)
                      .map((comment) => {
                        if (!comment || !comment._id) return null;
                        const postId = typeof comment.post === 'object' ? comment.post?._id : comment.post;
                        const postTitle = typeof comment.post === 'object' ? comment.post?.title : null;
                        return (
                          <div key={`comment-${comment._id}`} className="profile-comment-item" style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>COMMENT</div>
                            <div className="profile-comment-header">
                              <span 
                                className="profile-comment-post-title" 
                                onClick={() => postId && displayPost(postId)}
                                style={{ cursor: postId ? 'pointer' : 'default', color: '#D93900', fontWeight: '600' }}
                              >
                                {postTitle || "Post deleted"}
                              </span>
                              <span className="profile-comment-time" style={{ color: '#888', fontSize: '12px' }}>
                                {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}
                              </span>
                            </div>
                            <Comment 
                              comment={comment} 
                              onReply={() => {}} 
                              onVote={() => {
                                fetchUserData();
                              }} 
                              onDelete={() => {}} 
                            />
                            <div style={{ height: "1px", width: "100%", backgroundColor: "#3E4142", marginTop: "15px", marginBottom: "15px"}} />
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "Downvoted" && (
              <div className="tab-section">
                {isLoading ? (
                  <p style={{ color: "white", textAlign: "center", marginTop: "50px" }}>Loading...</p>
                ) : (downvotedPosts.length === 0 && downvotedComments.length === 0) ? (
                  <EmptyState title={emptyMessages.Downvoted} />
                ) : (
                  <div className="user-posts-list">
                    {downvotedPosts.map((p) => (
                      <div key={`post-${p._id}`} style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>POST</div>
                        <Post post={p} user={p.user} community={p.community} readOnly={true} onClick={() => displayPost(p._id)} />
                        <div style={{ height: "1px", width: "590px", backgroundColor: "#3E4142", marginTop: "15px", marginBottom: "15px"}} />
                      </div>
                    ))}
                    {downvotedComments
                      .filter(comment => comment && comment._id)
                      .map((comment) => {
                        if (!comment || !comment._id) return null;
                        const postId = typeof comment.post === 'object' ? comment.post?._id : comment.post;
                        const postTitle = typeof comment.post === 'object' ? comment.post?.title : null;
                        return (
                          <div key={`comment-${comment._id}`} className="profile-comment-item" style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>COMMENT</div>
                            <div className="profile-comment-header">
                              <span 
                                className="profile-comment-post-title" 
                                onClick={() => postId && displayPost(postId)}
                                style={{ cursor: postId ? 'pointer' : 'default', color: '#D93900', fontWeight: '600' }}
                              >
                                {postTitle || "Post deleted"}
                              </span>
                              <span className="profile-comment-time" style={{ color: '#888', fontSize: '12px' }}>
                                {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}
                              </span>
                            </div>
                            <Comment 
                              comment={comment} 
                              onReply={() => {}} 
                              onVote={() => {
                                fetchUserData();
                              }} 
                              onDelete={() => {}} 
                            />
                            <div style={{ height: "1px", width: "100%", backgroundColor: "#3E4142", marginTop: "15px", marginBottom: "15px"}} />
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
      />
      {showCreatePost && (
        <CreatePost
          onClose={() => setShowCreatePost(false)}
          onPostCreated={(newPost) => {
            setShowCreatePost(false);
            setPosts((prevPosts) => [newPost, ...prevPosts]);
          }}
        />
      )}
    </div>
  );
};

export default ProfilePage;
