import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css'; // Optional: Add styles

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/resume">Resume</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
