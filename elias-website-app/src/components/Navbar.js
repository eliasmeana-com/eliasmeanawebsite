import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css'; // Optional: Add styles

function Dropdown({ title, items }) {
  return (
    <li className="dropdown">
      <span className="dropdown-title">{title}</span>
      <ul className="dropdown-menu">
        {items.map((item, index) => (
          <li key={index} className="dropdown-item">
            {item.submenu ? (
              <>
                <span className="dropdown-item">{item.title}</span>
                <ul className="submenu">
                  {item.submenu.map((subitem, subIndex) => (
                    <li key={subIndex} className="submenu-item">
                      <Link to={subitem.link}>{subitem.title}</Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <Link to={item.link}>{item.title}</Link>
            )}
          </li>
        ))}
      </ul>
    </li>
  );
}

function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const birlaMenuItems = [
    {
      title: 'Research',
      submenu: [
        { title: 'Birla Poster', link: '/birla' },
        { title: 'D-wave Proposal', link: '/dwave' },
      ],
    },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-header">
        <button className="hamburger" onClick={toggleMobileMenu}>
          &#9776;
        </button>
        <ul className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/resume">Resume</Link></li>
          <Dropdown title="Other Stuff" items={birlaMenuItems} />
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
