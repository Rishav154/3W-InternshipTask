import React from 'react';
import { Home, ClipboardList, Globe, Trophy, MessageCircle } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { name: 'Home', icon: <Home size={20} /> },
    { name: 'Tasks', icon: <ClipboardList size={20} /> },
    { name: 'Social', icon: <Globe size={20} />, active: true },
    { name: 'Leader Board', icon: <Trophy size={20} /> },
    { name: 'Chat', icon: <MessageCircle size={20} /> }
  ];

  return (
    <nav className="bottom-nav-bar">
      {navItems.map((item, index) => (
        <button
          key={index}
          type="button"
          className={`bottom-nav-item ${item.active ? 'active' : ''}`}
          onClick={() => {
            if (!item.active) {
              alert(`${item.name} tab clicked (Visual Only. Try out the Social Tab!)`);
            }
          }}
        >
          <div className="nav-icon-container">
            {item.icon}
          </div>
          <span className="nav-label">{item.name}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
