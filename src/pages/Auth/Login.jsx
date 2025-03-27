import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './auth.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginData.username || !loginData.password) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter both username and password!',
        customClass: {
          popup: 'fb-swal-popup'
        }
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/v1/user/login', {
        username: loginData.username,
        password: loginData.password
      });

    console.log('login response:',response.data)
      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Welcome back to SkillShare!',
        customClass: {
          popup: 'fb-swal-popup'
        },
        showConfirmButton: false,
        timer: 2000
      }).then(() => {
        navigate("/")
      });

    } catch (error) {

      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.message || 'Unable to login. Please try again.',
        customClass: {
          popup: 'fb-swal-popup'
        },
        showConfirmButton: false,
        timer: 2000
      });
    }
  };
  
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
          <form className="fb-form" onSubmit={handleLogin}>
            <div className="fb-input-group">
              <input 
                type="text" 
                placeholder="Email address"
                name='username'
                value={loginData.username}
                onChange={handleChange}
              />
            </div>
            
            <div className="fb-input-group">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password"
                name='password'
                value={loginData.password}
                onChange={handleChange}
              />
              <button 
                type="button" 
                className="fb-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
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
            
            <Link to="/register" className="fb-create-btn">
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