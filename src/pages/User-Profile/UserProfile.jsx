import React, { useState } from 'react';
import './userprofile.css';
import Posts from '../../components/Skill-Sharing-Post/post/Posts';

function UserProfile() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const handleFollowClick = () => {
    setIsFollowing(prev => !prev);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  return (
    <div className="user-profile">
      <div className="profile-top">
        <div className="profile-image-wrapper">
          <img
            src={profileImage || "https://via.placeholder.com/120"}
            alt="Profile"
            className="profile-image"
          />
          <label className="upload-button">
            Upload
            <input type="file" onChange={handleImageUpload} />
          </label>
        </div>
        <div className="profile-actions">
          <h2 className="user-name">John Doe</h2>
          <button
            onClick={handleFollowClick}
            className={`follow-btn ${isFollowing ? 'following' : ''}`}
          >
            {isFollowing ? "Following ✓" : "Follow +"}
          </button>
        </div>
      </div>

      <div className="posts-section">
        <h3>Posts</h3>
       <Posts editable={true}/>
      </div>
    </div>
  );
}

export default UserProfile;
