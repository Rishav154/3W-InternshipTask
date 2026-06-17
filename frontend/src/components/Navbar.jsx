import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, Moon, LogOut, LogIn, Award } from 'lucide-react';

const Navbar = ({ onOpenAuth }) => {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="header-top-row">
        {/* Left Logo */}
        <h1 className="brand-logo">Social</h1>

        {/* Right Info Section */}
        <div className="header-status-group">
          {/* Coin Badge */}
          <div className="status-badge coin-badge">
            <span className="badge-value">50</span>
            <span className="badge-icon-star">★</span>
          </div>

          {/* Currency Badge */}
          <div className="status-badge currency-badge">
            <span className="badge-value">₹0.00</span>
          </div>

          {/* Bell Icon */}
          <button type="button" className="header-icon-btn bell-btn" title="Notifications">
            <Bell size={20} />
            <span className="notification-dot">1</span>
          </button>

          {/* User Account / Login */}
          {user ? (
            <div className="header-user-controls">
              <div 
                className="user-profile-circle" 
                style={{ backgroundColor: user.avatarColor }}
                title={`Logged in as ${user.username}`}
              >
                {user.username.substring(0, 2).toUpperCase()}
              </div>
              <button 
                type="button" 
                className="header-logout-btn" 
                onClick={logout}
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              type="button" 
              className="header-login-btn" 
              onClick={onOpenAuth}
              title="Log In / Sign Up"
            >
              <LogIn size={18} />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Header Search & Theme Row */}
      <div className="header-search-row">
        <div className="search-bar-wrapper">
          <input 
            type="text" 
            placeholder="Search promotions, users, posts..." 
            className="search-input"
          />
          <button type="button" className="search-submit-btn">
            <Search size={16} />
          </button>
        </div>

        <button type="button" className="theme-toggle-btn" title="Toggle Theme (Visual Only)">
          <Moon size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
