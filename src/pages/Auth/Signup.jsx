import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './auth.css';

export default function Signup() {
  const [birthdate, setBirthdate] = useState({
    month: '',
    day: '',
    year: ''
  });
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  
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
          <div className="fb-signup-card">
            <div className="fb-signup-header">
              <h2>Create a new account</h2>
              <p>It's quick and easy.</p>
            </div>
            <div className="fb-divider"></div>
            
            <form className="fb-form">
              <div className="fb-name-row">
                <input 
                  type="text" 
                  placeholder="First name"
                />
                <input 
                  type="text" 
                  placeholder="Last name"
                />
              </div>
              
              <div className="fb-input-group">
                <input 
                  type="email" 
                  placeholder="Email address"
                />
              </div>
              
              <div className="fb-input-group">
                <input 
                  type="password" 
                  placeholder="New password"
                />
              </div>
              
              <div className="fb-birthday-section">
                <label>Birthday</label>
                <div className="fb-birthday-selects">
                  <select 
                    value={birthdate.month}
                    onChange={(e) => setBirthdate({...birthdate, month: e.target.value})}
                  >
                    <option value="" disabled>Month</option>
                    {months.map((month, index) => (
                      <option key={month} value={index + 1}>{month}</option>
                    ))}
                  </select>
                  
                  <select 
                    value={birthdate.day}
                    onChange={(e) => setBirthdate({...birthdate, day: e.target.value})}
                  >
                    <option value="" disabled>Day</option>
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  
                  <select 
                    value={birthdate.year}
                    onChange={(e) => setBirthdate({...birthdate, year: e.target.value})}
                  >
                    <option value="" disabled>Year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="fb-gender-section">
                <label>Gender</label>
                <div className="fb-gender-options">
                  <label className="fb-radio-label">
                    <input type="radio" name="gender" value="female" />
                    <span>Female</span>
                  </label>
                  
                  <label className="fb-radio-label">
                    <input type="radio" name="gender" value="male" />
                    <span>Male</span>
                  </label>
                  
                  <label className="fb-radio-label">
                    <input type="radio" name="gender" value="custom" />
                    <span>Custom</span>
                  </label>
                </div>
              </div>
              
              <p className="fb-terms">
                By clicking Sign Up, you agree to our <Link to="/terms">Terms</Link>, <Link to="/privacy">Privacy Policy</Link> and <Link to="/cookies">Cookies Policy</Link>.
              </p>
              
              <button type="submit" className="fb-signup-btn">
                Sign Up
              </button>
              
              <div className="fb-login-link">
                <Link to="/login">Already have an account?</Link>
              </div>
            </form>
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