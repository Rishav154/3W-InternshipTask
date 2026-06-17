import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Signup = ({ onSwitchToLogin, onSuccess }) => {
  const { signup } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    // Basic username format check (no special characters except underscores)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const result = await signup(username, email, password);
      if (result.success) {
        if (onSuccess) onSuccess();
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <div className="auth-logo">
          <UserPlus size={28} className="auth-logo-icon" />
        </div>
        <h2>Create Account</h2>
        <p>Sign up to start sharing and interacting with friends</p>
      </div>

      {error && <div className="auth-error-alert">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="signup-username">Username</label>
          <div className="input-wrapper">
            <User size={18} className="input-icon" />
            <input
              id="signup-username"
              type="text"
              placeholder="choose_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <span className="input-tip">Only letters, numbers, and underscores.</span>
        </div>

        <div className="form-group">
          <label htmlFor="signup-email">Email Address</label>
          <div className="input-wrapper">
            <Mail size={18} className="input-icon" />
            <input
              id="signup-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="signup-password">Password</label>
          <div className="input-wrapper">
            <Lock size={18} className="input-icon" />
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create strong password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              tabIndex="-1"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="signup-confirm-password">Confirm Password</label>
          <div className="input-wrapper">
            <Lock size={18} className="input-icon" />
            <input
              id="signup-confirm-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? (
            <span className="spinner"></span>
          ) : (
            <>
              <span>Sign Up</span>
              <UserPlus size={18} />
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Already have an account?{' '}
          <button type="button" className="auth-switch-link" onClick={onSwitchToLogin} disabled={loading}>
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
