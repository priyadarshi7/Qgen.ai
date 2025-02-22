import React, { useState } from 'react';
import { Menu, X, Moon, Search, User } from 'lucide-react';
import './Navbar.css';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Moon className="navbar-logo" />
          <span className="navbar-title">QGen.ai</span>
        </div>

        <div className="navbar-menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </div>

        <ul className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <li><a href="#home" className="nav-link">Home</a></li>
          <li className='nav-link'><NavLink to="/pdf" style={{textDecoration:"none"}}>PDF</NavLink></li>
          <li><a href="#services" className="nav-link">Services</a></li>
          <li><a href="#contact" className="nav-link">Contact</a></li>
        </ul>

        <div className="navbar-actions">
          <button className="action-button">
            <Search className="action-icon" />
          </button>
          <button className="action-button">
            <User className="action-icon" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;