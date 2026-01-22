import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ username, onLogout }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/dashboard">Smart City System</Link>
        </div>
        <div className="navbar-menu">
          <Link to="/dashboard" className={isActive('/dashboard')}>
            Dashboard
          </Link>
          <Link to="/traffic" className={isActive('/traffic')}>
            Traffic
          </Link>
          <Link to="/energy" className={isActive('/energy')}>
            Energy
          </Link>
          <Link to="/water" className={isActive('/water')}>
            Water
          </Link>
          <Link to="/waste" className={isActive('/waste')}>
            Waste
          </Link>
          <Link to="/air" className={isActive('/air')}>
            Air Quality
          </Link>
          <Link to="/reports" className={isActive('/reports')}>
            Reports
          </Link>
          <Link to="/settings" className={isActive('/settings')}>
            Settings
          </Link>
        </div>
        <div className="navbar-user">
          <Link to="/profile" className={isActive('/profile')} style={{ textDecoration: 'none', color: 'white', marginRight: '15px' }}>
            👤 {username}
          </Link>
          <button onClick={onLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



