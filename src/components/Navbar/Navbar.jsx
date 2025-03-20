import React, { useState } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import profileImg from "../../assets/images/profile.png";

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock notifications - would come from your API in production
  const notifications = [
    {
      id: 1,
      type: "like",
      username: "JaneDoe",
      content: "liked your post about JavaScript basics",
      time: "5m ago",
    },
    {
      id: 2,
      type: "comment",
      username: "JohnSmith",
      content: "commented on your photography skills post",
      time: "20m ago",
    },
    {
      id: 3,
      type: "follow",
      username: "MikeJohnson",
      content: "started following you",
      time: "1h ago",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle search functionality
    console.log("Searching for:", searchQuery);
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="fas fa-share-alt text-primary me-2 fs-3"></i>
          <span className="fw-bold text-primary">SkillShare</span>
        </Link>

        <form
          className="d-none d-md-flex position-relative ms-4 flex-grow-1"
          onSubmit={handleSubmit}
        >
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="fas fa-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control bg-light border-start-0"
              placeholder="Search skills, topics, or users"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">
            <li className="nav-item px-2">
              <Link className="nav-link" to="/">
                <i className="fas fa-home fs-4"></i>
              </Link>
            </li>
            <li className="nav-item px-2">
              <Link className="nav-link" to="/skills">
                <i className="fas fa-lightbulb fs-4"></i>
              </Link>
            </li>
            <li className="nav-item px-2">
              <Link className="nav-link" to="/learning-plans">
                <i className="fas fa-book fs-4"></i>
              </Link>
            </li>

            <li className="nav-item px-2 dropdown">
              <div className="d-flex">
                <li className="nav-item ms-2">
                  <Link className="btn btn-outline-primary" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item ms-2">
                  <Link className="btn btn-primary" to="/register">
                    Sign Up
                  </Link>
                </li>
              </div>
              {/* <a 
                className="nav-link position-relative" 
                href="#" 
                role="button" 
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <i className="fas fa-bell fs-4"></i>
                {notifications.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {notifications.length}
                  </span>
                )}
              </a> */}

              {/* Notifications dropdown */}
              {/* {showNotifications && (
                <div className="dropdown-menu notification-dropdown shadow show">
                  <h6 className="dropdown-header">Notifications</h6>
                  {notifications.map(notification => (
                    <a key={notification.id} className="dropdown-item notification-item" href="#">
                      <div className="d-flex align-items-center">
                        <div className="notification-icon me-3">
                          {notification.type === 'like' && <i className="fas fa-heart text-danger"></i>}
                          {notification.type === 'comment' && <i className="fas fa-comment text-primary"></i>}
                          {notification.type === 'follow' && <i className="fas fa-user-plus text-success"></i>}
                        </div>
                        <div className="notification-content">
                          <p className="mb-0"><strong>{notification.username}</strong> {notification.content}</p>
                          <small className="text-muted">{notification.time}</small>
                        </div>
                      </div>
                    </a>
                  ))}
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item text-center" href="#">See all notifications</a>
                </div>
              )} */}
            </li>

            {/* User profile */}
            {/* <li className="nav-item px-2 dropdown">
              <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
                <img 
                  src={profileImg}
                  alt="Profile" 
                  className="rounded-circle me-md-2" 
                  width="32" 
                  height="32" 
                />
                <span className="d-none d-md-block">User</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end shadow">
                <li><Link className="dropdown-item" to="/profile">My Profile</Link></li>
                <li><Link className="dropdown-item" to="/settings">Settings</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="/logout">Logout</Link></li>
              </ul>
            </li> */}
          </ul>
        </div>
      </div>
    </nav>
  );
}
