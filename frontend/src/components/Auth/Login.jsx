import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Eye, EyeOff, Mail, Lock } from 'lucide-react';

const Login = ({ onSwitchToSignup, onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      if (result.success) {
        if (onSuccess) onSuccess();
      } else {
        setError(result.message || 'Invalid email or password');
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
          <LogIn size={28} className="auth-logo-icon" />
        </div>
        <h2>Welcome Back</h2>
        <p>Login to your account to share posts, like, and comment</p>
      </div>

      {error && <div className="auth-error-alert">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="login-email">Email Address</label>
          <div className="input-wrapper">
            <Mail size={18} className="input-icon" />
            <input
              id="login-email"
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
          <label htmlFor="login-password">Password</label>
          <div className="input-wrapper">
            <Lock size={18} className="input-icon" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
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

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? (
            <span className="spinner"></span>
          ) : (
            <>
              <span>Log In</span>
              <LogIn size={18} />
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Don't have an account?{' '}
          <button type="button" className="auth-switch-link" onClick={onSwitchToSignup} disabled={loading}>
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
