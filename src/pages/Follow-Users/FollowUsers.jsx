import React, { useContext, useEffect, useState } from 'react';
import Sidebar2 from '../../components/Sidebar/Sidebar2';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import '../Follow-Users/followUser.css';
import { UserContext } from '../../common/UserContext';
import { toast } from 'react-toastify';

export default function FollowUsers() {
    const [allUsers, setAllUsers] = useState([]);
    const [followedUsers, setFollowedUsers] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [followLoading, setFollowLoading] = useState({}); // Track loading state for each follow button
    const { user } = useContext(UserContext);
    const [error, setError] = useState(null);

    // API base URL constant - easier to update in one place
    const API_BASE_URL = 'http://localhost:8080/api/v1';

    useEffect(() => {
        if (user?.id) {
            // Load followed users first to ensure we have that data before showing users
            getFollowedUsers().then(() => {
                getAllUsers();
            });

            // Apply stored follows from localStorage on initial render
            const storedFollows = JSON.parse(localStorage.getItem(`follows_${user.id}`) || '[]');
            if (storedFollows.length > 0) {
                // Apply stored follows immediately while API call is in progress
                setFollowedUsers(new Set(storedFollows));
            }
        }
    }, [user?.id]);

    const getAllUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${API_BASE_URL}/user/all-users`);
            
            // Filter out current user and sort by name for better UX
            const filteredUsers = response.data
                .filter(u => u.id !== user?.id)
                .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                
            setAllUsers(filteredUsers); 
        } catch (error) {
            console.error('Error fetching all users:', error);
            setError('Failed to load user suggestions. Please try again later.');
            toast.error('Failed to load user suggestions');
        } finally {
            setLoading(false);
        }
    };

    const getFollowedUsers = async () => {
        try {
            setError(null);
            const response = await axios.get(`${API_BASE_URL}/follow/following/${user.id}`);
            const following = response.data.map(followUser => followUser.userId);
            console.log("Followed users loaded:", following);
            setFollowedUsers(new Set(following));
            
            // Update localStorage with server data
            localStorage.setItem(`follows_${user.id}`, JSON.stringify(following));
            
            return following; // Return data for chaining
        } catch (error) {
            console.error('Error fetching followed users:', error);
            toast.error('Failed to load your followed users');
            return []; // Return empty array if error
        }
    };

    const handleFollow = async (userId, userName) => {
        if (followLoading[userId]) return; // Prevent double clicks
        
        try {
            // Update local loading state for this specific button
            setFollowLoading(prev => ({ ...prev, [userId]: true }));
            
            // Make API call
            await axios.patch(`${API_BASE_URL}/follow/${user.id}/follow/${userId}`);
            
            // Add to followed users set
            setFollowedUsers(prev => {
                const newSet = new Set(prev);
                newSet.add(userId);
                return newSet;
            });
            
            // Update local storage to persist follows between page refreshes
            const storedFollows = JSON.parse(localStorage.getItem(`follows_${user.id}`) || '[]');
            if (!storedFollows.includes(userId)) {
                localStorage.setItem(`follows_${user.id}`, JSON.stringify([...storedFollows, userId]));
            }
            
            toast.success(`You are now following ${userName || 'this user'}`);
        } catch (error) {
            console.error('Error following user:', error);
            
            if (error.response && error.response.status === 409) {
                toast.info('You are already following this user');
                
                // Ensure UI reflects this
                setFollowedUsers(prev => {
                    const newSet = new Set(prev);
                    newSet.add(userId);
                    return newSet;
                });
                
                // Update local storage
                const storedFollows = JSON.parse(localStorage.getItem(`follows_${user.id}`) || '[]');
                if (!storedFollows.includes(userId)) {
                    localStorage.setItem(`follows_${user.id}`, JSON.stringify([...storedFollows, userId]));
                }
            } else {
                toast.error('Failed to follow user');
            }
        } finally {
            // Reset loading state
            setFollowLoading(prev => ({ ...prev, [userId]: false }));
        }
    };

    const handleUnfollow = async (userId, userName) => {
        if (followLoading[userId]) return; // Prevent double clicks
        
        try {
            // Update local loading state for this specific button
            setFollowLoading(prev => ({ ...prev, [userId]: true }));
            
            // Make API call
            await axios.patch(`${API_BASE_URL}/follow/${user.id}/unfollow/${userId}`);
            
            // Remove from followed users set
            setFollowedUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
            
            // Update local storage to persist unfollows between page refreshes
            const storedFollows = JSON.parse(localStorage.getItem(`follows_${user.id}`) || '[]');
            const updatedFollows = storedFollows.filter(id => id !== userId);
            localStorage.setItem(`follows_${user.id}`, JSON.stringify(updatedFollows));
            
            toast.info(`You have unfollowed ${userName || 'this user'}`);
        } catch (error) {
            console.error('Error unfollowing user:', error);
            toast.error('Failed to unfollow user');
        } finally {
            // Reset loading state
            setFollowLoading(prev => ({ ...prev, [userId]: false }));
        }
    };

    const handleRemoveSuggestion = (userId) => {
        // Remove user from suggestions list
        setAllUsers(prev => prev.filter(user => user.id !== userId));
        toast.info('Suggestion removed');
    };

    // Function to refresh user suggestions
    const refreshSuggestions = () => {
        getAllUsers();
        toast.info('Refreshing suggestions...');
    };

    return (
        <div className="container-fluid p-0 follow-users-page">
            <Navbar />
            <div className="row g-0">
                <div className="col-lg-2">
                    <Sidebar />
                </div>
                <div className="col-lg-8 main-content">
                    <div className="container-fluid p-4">
                        <div className="row">
                            <div className="col-12">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h2 className="fw-bold">People You May Know</h2>
                                    <button 
                                        className="btn btn-light refresh-btn"
                                        onClick={refreshSuggestions}
                                        disabled={loading}
                                    >
                                        <i className="bi bi-arrow-clockwise me-1"></i>
                                        Refresh
                                    </button>
                                </div>
                                
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}
                                
                                {loading ? (
                                    <div className="text-center p-5 no-users-message">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-3">Looking for more people you may know...</p>
                                    </div>
                                ) : (
                                    <>
                                        {allUsers.length > 0 ? (
                                            <div className="user-grid facebook-style-grid">
                                                {allUsers.map((fUser) => (
                                                    <div key={fUser.id} className="user-card facebook-style">
                                                        <div className="user-card-header">
                                                            {fUser.imgUrl ? (
                                                                <img 
                                                                    src={fUser.imgUrl} 
                                                                    alt={fUser.name || 'User'} 
                                                                    className="user-cover-photo"
                                                                />
                                                            ) : (
                                                                <div className="user-cover-photo-placeholder"></div>
                                                            )}
                                                            <div className="user-avatar-container">
                                                                {fUser.imgUrl ? (
                                                                    <img 
                                                                        src={fUser.imgUrl} 
                                                                        alt={fUser.name || 'User'} 
                                                                        className="user-avatar"
                                                                    />
                                                                ) : (
                                                                    <div className="user-avatar-placeholder">
                                                                        {(fUser.name ? fUser.name.charAt(0) : 'U').toUpperCase()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="user-card-body">
                                                            <h5 className="user-name">{fUser.name || 'Unknown User'}</h5>
                                                            
                                                            <div className="action-buttons">
                                                                {followedUsers.has(fUser.id) ? (
                                                                    <button 
                                                                        className="following-btn"
                                                                        onClick={() => handleUnfollow(fUser.id, fUser.name)}
                                                                        disabled={followLoading[fUser.id]}
                                                                    >
                                                                        {followLoading[fUser.id] ? (
                                                                            <>
                                                                                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                                                                Processing...
                                                                            </>
                                                                        ) : (
                                                                            <>Following</>
                                                                        )}
                                                                    </button>
                                                                ) : (
                                                                    <button 
                                                                        className="follow-btn"
                                                                        onClick={() => handleFollow(fUser.id, fUser.name)}
                                                                        disabled={followLoading[fUser.id]}
                                                                    >
                                                                        {followLoading[fUser.id] ? (
                                                                            <>
                                                                                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                                                                Processing...
                                                                            </>
                                                                        ) : (
                                                                            <>Follow</>
                                                                        )}
                                                                    </button>
                                                                )}
                                                                <button 
                                                                    className="remove-btn"
                                                                    onClick={() => handleRemoveSuggestion(fUser.id)}
                                                                    title="Remove suggestion"
                                                                >
                                                                    <i className="bi bi-x-lg"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center p-5 no-users-message">
                                                <i className="bi bi-people-fill fs-1 mb-3 text-secondary"></i>
                                                <p>No user suggestions available at the moment.</p>
                                                <button 
                                                    className="btn btn-primary mt-2"
                                                    onClick={refreshSuggestions}
                                                >
                                                    <i className="bi bi-arrow-clockwise me-1"></i>
                                                    Try Again
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-2">
                    <Sidebar2 />
                </div>
            </div>
        </div>
    );
}