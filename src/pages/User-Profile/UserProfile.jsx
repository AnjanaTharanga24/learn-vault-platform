import React, { useContext, useState } from "react";
import "./userprofile.css";
import Posts from "../../components/Skill-Sharing-Post/post/Posts";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar2 from "../../components/Sidebar/Sidebar2";
import Sidebar from "../../components/Sidebar/Sidebar";
import { UserContext } from "../../common/UserContext";
import LearningProgressPosts from "../../components/Learning-Progress-Post/post/LearningProgressPosts";
import LearningPlanPosts from "../../components/Learning-Plan-Post/post/LearningPlanPosts";

function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const { user } = useContext(UserContext);

  return (
    <div>
      <div className="container-fluid p-0">
        <Navbar />
        <div className="row g-0">
          <div className="col-lg-2">
            <Sidebar />
          </div>
          <div className="col-lg-8 main-content">
            <div className="container-fluid p-4">
              <div className="user-profile">
                <div className="profile-header">
                  <h2 className="profile-title">My Profile</h2>
                  {!isEditing && (
                    <button
                      className="edit-profile-btn"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="edit-profile-form">
                    <div className="profile-image-wrapper edit-mode">
                      <img
                        src={user.imgUrl}
                        alt="Profile"
                        className="profile-image"
                      />
                      <label className="upload-button">
                        Change Photo
                        <input type="file" style={{ display: "none" }} />
                      </label>
                    </div>

                    <form>
                      <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={user.name}
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={user.username}
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={user.email}
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="password">
                          New Password (leave blank to keep current)
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          className="form-control"
                        />
                      </div>

                      <div className="form-actions">
                        <button type="submit" className="save-btn">
                          Save Changes
                        </button>
                        <button
                          type="button"
                          className="cancel-btn"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="profile-content">
                    <div className="profile-top">
                      <div className="profile-image-wrapper">
                        <img
                          src={user.imgUrl}
                          alt="Profile"
                          className="profile-image"
                        />
                      </div>
                      <div className="profile-info">
                        <h2 className="user-name">{user.name}</h2>
                        <p className="username">@{user.username}</p>
                        <p className="email">{user.email}</p>
                        <button className="follow-btn">Follow +</button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="posts-section">
                  <h3>Posts</h3>
                  <Posts editable={true} />
                  <LearningProgressPosts editable={true}/>
                  <LearningPlanPosts editable={true} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-2">
            <Sidebar2 />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
