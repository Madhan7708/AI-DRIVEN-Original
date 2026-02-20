import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ onLogout, onClose, onNavigation }) => {
  
  // Function to handle link click - closes sidebar
  const handleLinkClick = () => {
    if (onNavigation) {
      onNavigation();
    }
  };

  // Function to handle logout - closes sidebar and logs out
  const handleLogoutClick = () => {
    if (onNavigation) {
      onNavigation();
    }
    onLogout();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Dashboard</h2>
        <button className="close-sidebar" onClick={onClose} title="Close sidebar">
          ✕
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink 
              to="/dashboard/home" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              onClick={handleLinkClick}
            >
              <span className="icon">🏠</span>
              <span className="text">Home</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/dashboard/profile" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              onClick={handleLinkClick}
            >
              <span className="icon">👤</span>
              <span className="text">Applicanes Usages</span>
            </NavLink>
          </li>
          
          <li>
            <button onClick={handleLogoutClick} className="logout-button">
              <span className="icon">🚪</span>
              <span className="text">Logout</span>
            </button>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <p>© 2024 Your App</p>
      </div>
    </div>
  );
};

export default Sidebar;