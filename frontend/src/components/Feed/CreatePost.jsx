import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Image, Smile, AlignLeft, Send, X, AlertCircle } from 'lucide-react';

const CreatePost = ({ onPostCreated, onAuthRequired }) => {
  const { user, token, API_URL } = useAuth();
  const [text, setText] = useState('');
  const [image, setImage] = useState(null); // base64 string
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Limit to 4MB for safety
    if (file.size > 4 * 1024 * 1024) {
      setError('Image must be less than 4MB');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      onAuthRequired();
      return;
    }

    if (!text.trim() && !image) {
      setError('Please enter some text or add an image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          text: text.trim(),
          image
        })
      });

      const data = await res.json();

      if (data.success) {
        setText('');
        handleRemoveImage();
        if (onPostCreated) {
          onPostCreated(data.post);
        }
      } else {
        setError(data.message || 'Failed to create post');
      }
    } catch (err) {
      console.error('Post submit error:', err);
      setError('Error connecting to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to get initials
  const getInitials = (name) => {
    return name ? name.substring(0, 2).toUpperCase() : '??';
  };

  return (
    <div className="create-post-card">
      <div className="create-post-header">
        <h3>Create Post</h3>
        <div className="create-post-tabs">
          <button type="button" className="tab-pill active">All Posts</button>
          <button type="button" className="tab-pill disabled" title="Feature coming soon">Promotions</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="create-post-body">
        {error && (
          <div className="post-error-alert">
            <AlertCircle size={16} />
            <span>{error}</span>
            <button type="button" className="close-alert-btn" onClick={() => setError('')}>
              <X size={14} />
            </button>
          </div>
        )}

        <div className="input-row">
          <div 
            className="user-avatar-placeholder" 
            style={{ backgroundColor: user?.avatarColor || '#9ca3af' }}
          >
            {getInitials(user?.username || 'G')}
          </div>
          <textarea
            className="post-textarea"
            placeholder={user ? "What's on your mind?" : "Please log in to share a post..."}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading || !user}
            rows={3}
          />
        </div>

        {imagePreview && (
          <div className="image-preview-container">
            <img src={imagePreview} alt="Upload preview" className="post-image-preview" />
            <button
              type="button"
              className="remove-image-btn"
              onClick={handleRemoveImage}
              disabled={loading}
              title="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="create-post-footer">
          <div className="editor-tools">
            <button
              type="button"
              className="tool-btn"
              onClick={() => user ? fileInputRef.current?.click() : onAuthRequired()}
              disabled={loading}
              title="Add Image"
            >
              <Image size={20} className="tool-icon-camera" />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading || !user}
              />
            </button>
            <button 
              type="button" 
              className="tool-btn" 
              onClick={() => !user && onAuthRequired()} 
              title="Add Emoji (Visual Only)"
            >
              <Smile size={20} className="tool-icon-emoji" />
            </button>
            <button 
              type="button" 
              className="tool-btn animate-pulse" 
              onClick={() => !user && onAuthRequired()} 
              title="Align Text (Visual Only)"
            >
              <AlignLeft size={20} className="tool-icon-align" />
            </button>
          </div>

          <button
            type="submit"
            className="post-submit-btn"
            disabled={loading || (!text.trim() && !image) || !user}
          >
            {loading ? (
              <span className="spinner small"></span>
            ) : (
              <>
                <span>Post</span>
                <Send size={14} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
