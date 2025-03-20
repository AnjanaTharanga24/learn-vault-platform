import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './auth.css';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="fb-auth-container">
      <div className="fb-auth-content">
        <div className="fb-brand-section">
          <h1 className="fb-logo">SkillShare</h1>
          <p className="fb-tagline">
            Connect with skilled people and share your expertise with the world
          </p>
        </div>
        
        <div className="fb-form-section">
          <div className="fb-card">
            <form className="fb-form">
              <div className="fb-input-group">
                <input 
                  type="email" 
                  placeholder="Email address"
                />
              </div>
              
              <div className="fb-input-group">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password"
                />
                <button 
                  type="button" 
                  className="fb-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
              
              <button type="submit" className="fb-login-btn">
                Log In
              </button>
              
              <div className="fb-divider"></div>
              
              <Link to="/forgot-password" className="fb-forgot-link">
                Forgot password?
              </Link>
              
              <div className="fb-divider"></div>
              
              <Link to="/signup" className="fb-create-btn">
                Create New Account
              </Link>
            </form>
          </div>
          
          <div className="fb-create-page">
            <p><Link to="/create-page">Create a Page</Link> for your business, community, or skillset.</p>
          </div>
        </div>
      </div>
      
      <footer className="fb-footer">
        <div className="fb-footer-content">
          <div className="fb-language">
            <span>English (US)</span>
            <span>Español</span>
            <span>Français</span>
            <span>中文</span>
            <span>العربية</span>
            <span>Português</span>
            <span>Italiano</span>
            <span>한국어</span>
            <span>Deutsch</span>
            <span>हिन्दी</span>
            <span>日本語</span>
          </div>
          <div className="fb-divider"></div>
          <div className="fb-footer-links">
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Log In</Link>
            <Link to="/about">About</Link>
            <Link to="/help">Help</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/cookies">Cookies</Link>
            <Link to="/careers">Careers</Link>
          </div>
          <p className="fb-copyright">SkillShare © 2025</p>
        </div>
      </footer>
    </div>
  );
}