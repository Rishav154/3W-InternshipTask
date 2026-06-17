import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Heart, MessageSquare, Share2, Send, CornerDownRight, User } from 'lucide-react';

const PostCard = ({ post: initialPost, onAuthRequired }) => {
  const { user, token, API_URL } = useAuth();
  const [post, setPost] = useState(initialPost);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [showLikers, setShowLikers] = useState(false);

  // Sync state if initialPost updates from parent
  React.useEffect(() => {
    setPost(initialPost);
  }, [initialPost]);

  const hasLiked = user && post.likes.includes(user.username);

  // Helper to format timestamps relative to now
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    return `${diffDay}d ago`;
  };

  const handleLike = async () => {
    if (!user) {
      onAuthRequired();
      return;
    }

    // --- OPTIMISTIC UPDATE ---
    const previousLikes = [...post.likes];
    let updatedLikes = [...post.likes];
    
    if (hasLiked) {
      // Unlike
      updatedLikes = updatedLikes.filter(username => username !== user.username);
    } else {
      // Like
      updatedLikes.push(user.username);
    }

    // Set state immediately for instant feedback
    setPost(prev => ({
      ...prev,
      likes: updatedLikes
    }));

    try {
      const res = await fetch(`${API_URL}/posts/${post._id}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (data.success) {
        // Sync with actual server data
        setPost(prev => ({
          ...prev,
          likes: data.likes
        }));
      } else {
        // Rollback state on error
        setPost(prev => ({
          ...prev,
          likes: previousLikes
        }));
      }
    } catch (err) {
      console.error('Like request error:', err);
      // Rollback state on connection failure
      setPost(prev => ({
        ...prev,
        likes: previousLikes
      }));
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      onAuthRequired();
      return;
    }

    if (!commentText.trim()) return;

    setIsCommenting(true);

    // --- OPTIMISTIC UPDATE FOR COMMENTS ---
    const tempComment = {
      _id: Date.now().toString(),
      username: user.username,
      text: commentText.trim(),
      createdAt: new Date().toISOString()
    };

    const previousComments = [...post.comments];
    setPost(prev => ({
      ...prev,
      comments: [...prev.comments, tempComment]
    }));

    const oldText = commentText;
    setCommentText('');

    try {
      const res = await fetch(`${API_URL}/posts/${post._id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: oldText.trim() })
      });
      const data = await res.json();

      if (data.success) {
        // Sync comments array with real server data (which includes database IDs)
        setPost(prev => ({
          ...prev,
          comments: data.comments
        }));
      } else {
        // Rollback on server rejection
        setPost(prev => ({
          ...prev,
          comments: previousComments
        }));
        setCommentText(oldText);
      }
    } catch (err) {
      console.error('Comment request error:', err);
      // Rollback on network failure
      setPost(prev => ({
        ...prev,
        comments: previousComments
      }));
      setCommentText(oldText);
    } finally {
      setIsCommenting(false);
    }
  };

  // Helper to get initials
  const getInitials = (username) => {
    return username ? username.substring(0, 2).toUpperCase() : '??';
  };

  return (
    <div className="post-card">
      {/* Card Header */}
      <div className="post-card-header">
        <div className="post-author-info">
          <div 
            className="user-avatar-placeholder" 
            style={{ backgroundColor: post.avatarColor || '#3b82f6' }}
          >
            {getInitials(post.authorUsername)}
          </div>
          <div>
            <h4 className="post-author-name">
              {post.authorUsername === user?.username ? 'You' : post.authorUsername}
            </h4>
            <span className="post-author-handle">@{post.authorUsername.toLowerCase()}</span>
            <span className="post-time-dot">•</span>
            <span className="post-time">{formatTimeAgo(post.createdAt)}</span>
          </div>
        </div>
        <button 
          type="button" 
          className="follow-btn"
          onClick={() => {
            if (!user) onAuthRequired();
            else alert(`You followed @${post.authorUsername}`);
          }}
        >
          Follow
        </button>
      </div>

      {/* Card Content */}
      <div className="post-card-body">
        {post.text && <p className="post-text">{post.text}</p>}
        {post.image && (
          <div className="post-image-wrapper">
            <img src={post.image} alt="Post Attachment" className="post-image" loading="lazy" />
          </div>
        )}
      </div>

      {/* Card Stats & Actions */}
      <div className="post-card-actions">
        <div className="action-button-group">
          {/* Like Action */}
          <div className="action-item-container">
            <button
              type="button"
              className={`action-btn like-btn ${hasLiked ? 'liked' : ''}`}
              onClick={handleLike}
              title={hasLiked ? 'Unlike' : 'Like'}
            >
              <Heart size={20} fill={hasLiked ? '#ef4444' : 'none'} strokeWidth={hasLiked ? 0 : 2} />
              <span className="action-count">{post.likes.length}</span>
            </button>
            
            {post.likes.length > 0 && (
              <div 
                className="likers-indicator" 
                onMouseEnter={() => setShowLikers(true)}
                onMouseLeave={() => setShowLikers(false)}
                onClick={() => setShowLikers(!showLikers)}
              >
                Liked by...
                {showLikers && (
                  <div className="likers-dropdown">
                    <div className="likers-dropdown-header">Liked by</div>
                    <ul className="likers-list">
                      {post.likes.map((username, idx) => (
                        <li key={idx} className="liker-username">
                          <User size={12} />
                          <span>{username}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Comment Action Toggle */}
          <button
            type="button"
            className={`action-btn comment-btn ${showComments ? 'active' : ''}`}
            onClick={() => setShowComments(!showComments)}
            title="Toggle Comments"
          >
            <MessageSquare size={20} />
            <span className="action-count">{post.comments.length}</span>
          </button>
        </div>

        <button 
          type="button" 
          className="action-btn share-btn" 
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/post/${post._id}`);
            alert('Post link copied to clipboard!');
          }}
          title="Share Post"
        >
          <Share2 size={20} />
        </button>
      </div>

      {/* Comments Drawer */}
      {showComments && (
        <div className="comments-section">
          {post.comments.length > 0 ? (
            <div className="comments-list">
              {post.comments.map((comment) => (
                <div key={comment._id} className="comment-item">
                  <div className="comment-avatar-container">
                    <div className="comment-avatar">
                      {getInitials(comment.username)}
                    </div>
                  </div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-username">{comment.username}</span>
                      <span className="comment-time">{formatTimeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="comment-text-body">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-comments">
              <CornerDownRight size={18} />
              <span>No comments yet. Be the first to say something!</span>
            </div>
          )}

          {/* Comment Input */}
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <input
              type="text"
              placeholder={user ? "Write a comment..." : "Please log in to comment..."}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={isCommenting || !user}
              className="comment-input"
            />
            <button
              type="submit"
              className="comment-send-btn"
              disabled={isCommenting || !commentText.trim() || !user}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;
