// src/components/Navbar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  LogIn, 
  UserPlus 
} from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={14} /> },
    { name: 'Add Subscription', path: '/add-subscription', icon: <PlusCircle size={14} /> },
    { name: 'Login', path: '/login', icon: <LogIn size={14} /> },
    { name: 'Register', path: '/register', icon: <UserPlus size={14} /> },
  ];

  return (
    <nav className="navbar-container">
      {/* Large Brand Heading */}
      <div className="brand-header">
        <h1 className="brand-title">Subscription Manager</h1>
      </div>

      {/* Tabs with Underline Indicator */}
      <div className="tabs-container">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              isActive ? 'tab-item active' : 'tab-item'
            }
          >
            <span className="tab-icon">{item.icon}</span>
            <span className="tab-label">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;