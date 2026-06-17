import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import { RefreshCw, ArrowLeft, ArrowRight, Layers } from 'lucide-react';

const PostFeed = ({ onAuthRequired }) => {
  const { API_URL } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // Smaller limit (5) makes pagination easier to demonstrate
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  // Tab State
  const [activeTab, setActiveTab] = useState('All Post');

  const fetchPosts = async (pageNumber = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/posts?page=${pageNumber}&limit=${limit}`);
      const data = await res.json();

      if (data.success) {
        setPosts(data.posts);
        setPage(data.pagination.page);
        setTotalPages(data.pagination.totalPages);
        setTotalPosts(data.pagination.totalPosts);
      } else {
        setError(data.message || 'Failed to fetch posts');
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Could not connect to the server. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const handlePostCreated = (newPost) => {
    // Prepend the new post immediately, reset tab to "All Post" and page to 1
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setPage(1);
    setActiveTab('All Post');
    fetchPosts(1); // Re-fetch to get correct pagination counters
  };

  const handleRefresh = () => {
    fetchPosts(page);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Dynamic client-side sorting/filtering based on activeTab
  const getProcessedPosts = () => {
    const postsCopy = [...posts];
    if (activeTab === 'Most Liked') {
      return postsCopy.sort((a, b) => b.likes.length - a.likes.length);
    }
    if (activeTab === 'Most Commented') {
      return postsCopy.sort((a, b) => b.comments.length - a.comments.length);
    }
    if (activeTab === 'For You') {
      // Shuffled representation of current page
      return postsCopy.sort(() => 0.5 - Math.random());
    }
    return posts; // Default chronological sorting
  };

  const processedPosts = getProcessedPosts();

  const tabs = ['All Post', 'For You', 'Most Liked', 'Most Commented'];

  return (
    <div className="feed-container">
      {/* Create Post Widget */}
      <CreatePost onPostCreated={handlePostCreated} onAuthRequired={onAuthRequired} />

      {/* Feed Filter Tabs */}
      <div className="feed-tabs-row">
        <div className="tabs-wrapper">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`feed-filter-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <button 
          type="button" 
          className={`refresh-btn ${loading ? 'spinning' : ''}`}
          onClick={handleRefresh}
          title="Refresh Feed"
          disabled={loading}
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Posts Content */}
      {error && (
        <div className="feed-error-card">
          <p>{error}</p>
          <button type="button" onClick={() => fetchPosts(page)} className="retry-btn">
            Retry Connection
          </button>
        </div>
      )}

      {loading ? (
        <div className="skeleton-feed">
          {[1, 2, 3].map((n) => (
            <div key={n} className="skeleton-card">
              <div className="skeleton-header">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-user-meta">
                  <div className="skeleton-line short"></div>
                  <div className="skeleton-line extra-short"></div>
                </div>
              </div>
              <div className="skeleton-body">
                <div className="skeleton-line"></div>
                <div className="skeleton-line medium"></div>
              </div>
            </div>
          ))}
        </div>
      ) : processedPosts.length > 0 ? (
        <div className="posts-feed-list">
          {processedPosts.map((post) => (
            <PostCard key={post._id} post={post} onAuthRequired={onAuthRequired} />
          ))}
        </div>
      ) : (
        !error && (
          <div className="empty-feed-card">
            <Layers size={48} className="empty-feed-icon" />
            <h3>No Posts Found</h3>
            <p>Be the first one to create a post! Type something in the box above to get started.</p>
          </div>
        )
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="pagination-bar">
          <button
            type="button"
            className="pagination-arrow-btn"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            title="Previous Page"
          >
            <ArrowLeft size={16} />
            <span>Prev</span>
          </button>

          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                className={`pagination-number-btn ${page === pageNum ? 'active' : ''}`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="pagination-arrow-btn"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            title="Next Page"
          >
            <span>Next</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
      
      {!loading && totalPosts > 0 && (
        <div className="pagination-summary">
          Showing posts { (page - 1) * limit + 1 } - { Math.min(page * limit, totalPosts) } of { totalPosts }
        </div>
      )}
    </div>
  );
};

export default PostFeed;
