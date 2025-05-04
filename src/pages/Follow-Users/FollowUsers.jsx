import React, { useContext, useEffect, useState } from 'react';
import Sidebar2 from '../../components/Sidebar/Sidebar2';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import '../Follow-Users/followUser.css';
import { toast } from 'react-toastify'; 
import { UserContext } from '../../common/UserContext';

export default function FollowUsers() {
    const [allUsers, setAllUsers] = useState([]);
    const [followStatus, setFollowStatus] = useState({});
    const [loading, setLoading] = useState(true);
    const { currentUser } = useContext(UserContext);
    
    useEffect(() => {      
        getAllUsers();
    }, []);

    const getAllUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/api/v1/user/all-users`);
            
            // Get current user ID from context or localStorage as fallback
            const currentUserId = currentUser?._id || JSON.parse(localStorage.getItem('user'))?._id;
            
            if (currentUserId) {
                // Filter out the current user from the list
                const filteredUsers = response.data.filter(user => user._id !== currentUserId);
                
                // Add mock mutual friends count for demo
                const usersWithMutualFriends = filteredUsers.map(user => ({
                    ...user,
                    mutualFriends: Math.floor(Math.random() * 10) // Random number for demo
                }));
                
                setAllUsers(usersWithMutualFriends);
                
                // Check if the current user is following each user
                checkFollowStatus(currentUserId, usersWithMutualFriends);
            } else {
                console.warn("No current user found, showing all users without follow status");
                
                // Just add mutual friends if no current user
                const usersWithMutualFriends = response.data.map(user => ({
                    ...user,
                    mutualFriends: Math.floor(Math.random() * 10)
                }));
                setAllUsers(usersWithMutualFriends);
                
                // Initialize all as not followed
                const initialStatus = {};
                usersWithMutualFriends.forEach(user => {
                    initialStatus[user._id] = false;
                });
                setFollowStatus(initialStatus);
            }
        } catch (error) {
            console.error('Error fetching all users', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    // Check if current user is following each user in the list
    const checkFollowStatus = async (currentUserId, users) => {
        try {
            // Get all users the current user is following
            const response = await axios.get(
                `http://localhost:8080/api/v1/follow/following/${currentUserId}`
            );
            
            const followingIds = response.data.map(user => user.userId);
            
            // Update follow status for each user
            const newFollowStatus = {};
            users.forEach(user => {
                newFollowStatus[user._id] = followingIds.includes(user._id);
            });
            
            setFollowStatus(newFollowStatus);
        } catch (error) {
            console.error('Error checking follow status', error);
            toast.error('Failed to fetch follow status');
        }
    };

    const handleFollow = async (userId) => {
        try {
            // Get current user ID from context or localStorage as fallback
            const currentUserId = currentUser?._id || JSON.parse(localStorage.getItem('user'))?._id;
            
            if (!currentUserId) {
                toast.error('You need to be logged in to follow users');
                return;
            }
            
            // Update local state first for immediate UI feedback
            setFollowStatus(prev => ({
                ...prev,
                [userId]: !prev[userId]
            }));
            
            if (followStatus[userId]) {
                // Unfollow logic
                console.log(`Attempting to unfollow user: ${userId}`);
                const response = await axios.patch(
                    `http://localhost:8080/api/v1/follow/${currentUserId}/unfollow/${userId}`
                );
                console.log('Unfollow response:', response.data);
                toast.success('User unfollowed successfully');
            } else {
                // Follow logic
                console.log(`Attempting to follow user: ${userId}`);
                const response = await axios.patch(
                    `http://localhost:8080/api/v1/follow/${currentUserId}/follow/${userId}`
                );
                console.log('Follow response:', response.data);
                toast.success('User followed successfully');
            }
        } catch (error) {
            console.error('Error following/unfollowing user', error);
            toast.error(error.response?.data?.message || error.response?.data || 'Failed to update follow status');
            
            // Revert the local state change if the API call failed
            setFollowStatus(prev => ({
                ...prev,
                [userId]: !prev[userId]
            }));
        }
    };

    const handleRemove = (userId) => {
        // Just remove from UI - doesn't affect actual following relationships
        setAllUsers(prev => prev.filter(user => user._id !== userId));
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
                                <h2 className="mb-4 text-center fw-bold">People You May Know</h2>
                                
                                {loading ? (
                                    <div className="text-center p-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-3">Loading users...</p>
                                    </div>
                                ) : (
                                    <>
                                        {allUsers.length > 0 ? (
                                            <div className="user-grid facebook-style-grid">
                                                {allUsers.map((user, index) => (
                                                    <div key={index} className="user-card facebook-style">
                                                        <div className="user-card-header">
                                                            {user.imgUrl ? (
                                                                <img 
                                                                    src={user.imgUrl} 
                                                                    alt={user.name || 'User'} 
                                                                    className="user-cover-photo"
                                                                />
                                                            ) : (
                                                                <div className="user-cover-photo-placeholder"></div>
                                                            )}
                                                            <div className="user-avatar-container">
                                                                {user.imgUrl ? (
                                                                    <img 
                                                                        src={user.imgUrl} 
                                                                        alt={user.name || 'User'} 
                                                                        className="user-avatar"
                                                                    />
                                                                ) : (
                                                                    <div className="user-avatar-placeholder">
                                                                        {(user.name ? user.name.charAt(0) : 'U').toUpperCase()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="user-card-body">
                                                            <h5 className="user-name">{user.name || 'Unknown User'}</h5>
                                                            {user.mutualFriends > 0 && (
                                                                <p className="mutual-friends">{user.mutualFriends} mutual friends</p>
                                                            )}
                                                            <div className="action-buttons">
                                                                <button 
                                                                    className={`add-friend-btn ${followStatus[user._id] ? 'friend-requested' : ''}`}
                                                                    onClick={() => handleFollow(user._id)}
                                                                >
                                                                    {followStatus[user._id] ? 'Following' : 'Follow'}
                                                                </button>
                                                                <button 
                                                                    className="remove-btn"
                                                                    onClick={() => handleRemove(user._id)}
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
                                                <p>No user suggestions available at the moment.</p>
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