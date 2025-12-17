import "./Community-Page.css";
import Post from '../Post/Post';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from '../../hooks/useAuthContext';
import useDisplayPost from "../../hooks/useDisplayPost";

function CommunityPage() {
    const { id } = useParams();
    const { user: currentUser } = useAuthContext();
    const displayPost = useDisplayPost();
    
    const [community, setCommunity] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isMember, setIsMember] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isJoining, setIsJoining] = useState(false);
    const [error, setError] = useState(null);

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
                // Check both community.members and user.communities for compatibility
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
            });

        // Fetch community posts
        fetch(`/api/communities/${id}/posts`)
            .then((res) => res.json())
            .then((data) => {
                setPosts(data);
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
                // Update membership state
                setIsMember(!isMember);
                
                // Update community data with new member count
                if (data.community) {
                    setCommunity(data.community);
                } else if (community) {
                    // Fallback: update locally
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
                
                // Update user's communities in localStorage if available
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
            </div>
        );
    }

    const memberCount = community.members?.length || 0;

    return (
        <div id="communityPage">
            {/* Community Header Banner */}
            <div id="communityBanner"></div>

            {/* Community Content Area */}
            <div id="communityContent">
                <div id="communityMain">
                    {/* Header Card Container - Aligned with Main Content */}
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
                    {/* Posts Section */}
                    <div id="postsSection">
                        {posts.length === 0 ? (
                            <div id="noPosts">
                                <p>No posts in this community yet.</p>
                                <p style={{ color: "#7a7a7a", fontSize: "14px", marginTop: "10px" }}>
                                    Be the first to post!
                                </p>
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

                {/* Community Sidebar */}
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
                                <button 
                                    id="joinLeaveButton"
                                    className={isMember ? "leave" : "join"}
                                    onClick={handleJoinLeave}
                                    disabled={isJoining || !currentUser}
                                >
                                    {isJoining ? "Loading..." : (isMember ? "Joined" : "Join")}
                                </button>
                            </div>
                            <div id="communityCreated">
                                <p>Created {new Date(community.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommunityPage;

