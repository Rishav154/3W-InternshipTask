import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import PostFeed from './components/Feed/PostFeed';
import BottomNav from './components/BottomNav';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import { X, Plus } from 'lucide-react';
import './App.css';

const MainAppContent = () => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState('login'); // 'login' | 'signup'

  const handleAuthRequired = () => {
    setAuthView('login');
    setShowAuthModal(true);
  };

  const handleOpenAuth = () => {
    setAuthView('login');
    setShowAuthModal(true);
  };

  const handleScrollToCreatePost = () => {
    if (!user) {
      handleAuthRequired();
      return;
    }
    const element = document.querySelector('.create-post-card');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Focus the textarea
      setTimeout(() => {
        const textarea = element.querySelector('.post-textarea');
        textarea?.focus();
      }, 500);
    }
  };

  return (
    <div className="app-frame-container">
      {/* Outer mock mobile container */}
      <div className="mobile-mockup-wrapper">
        <div className="mobile-screen">
          {/* Header */}
          <Navbar onOpenAuth={handleOpenAuth} />

          {/* Main Scrollable Feed */}
          <main className="main-feed-scroll">
            <PostFeed onAuthRequired={handleAuthRequired} />
          </main>

          {/* Floating Action Button (FAB) */}
          <button 
            type="button" 
            className="floating-action-btn"
            onClick={handleScrollToCreatePost}
            title="Create Post"
          >
            <Plus size={24} />
          </button>

          {/* Footer Bottom Nav */}
          <BottomNav />
        </div>
      </div>

      {/* Auth Modal Overlay */}
      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="modal-close-btn"
              onClick={() => setShowAuthModal(false)}
            >
              <X size={20} />
            </button>
            {authView === 'login' ? (
              <Login 
                onSwitchToSignup={() => setAuthView('signup')} 
                onSuccess={() => setShowAuthModal(false)} 
              />
            ) : (
              <Signup 
                onSwitchToLogin={() => setAuthView('login')} 
                onSuccess={() => setShowAuthModal(false)} 
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
};

export default App;
