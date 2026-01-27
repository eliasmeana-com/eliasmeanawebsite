import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const location = useLocation();
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveSubmenu(null);
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setActiveSubmenu(null);
  };

  const toggleSubmenu = (index) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Resume', path: '/resume' },
    {
      label: 'Other Stuff',
      children: [
        {
          label: 'Research',
          path: '/research',
          children: [
            { label: 'Peeling Method', path: '/pel' },
            { label: 'Birla Poster', path: '/birla' },
            { label: 'D-wave Proposal', path: '/dwave' }
          ]
        },
        {
          label: 'Blog',
          path:'/blogs',
          children: [
            { label: 'Politics', path: '/blogs/politics' },
            { label: 'Current Events', path: '/blogs/current-events' },
            { label: 'Math', path: '/blogs/math' },
            { label: 'General', path: '/blogs/general' },
          ]
        },
        { label: 'Music', path: '/music' },
        { label: 'Trip', path: '/trip' },
        { label: 'Schedule', path: '/schedule' },
        { label: 'Class Home', path: '/schoolhome' }
      ]
    },
    { label: authToken ? 'Logout' : 'Login', path: '/login' }
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="logo-area">
          <Link to="/" className="site-logo">EM</Link>
        </div>

        <nav className="desktop-nav">
          <ul className="desktop-list">
            {menuItems.map((item, index) => (
              <li key={index} className="desktop-item">
                <Link to={item.path} className="desktop-link">
                  {item.label}
                </Link>
                
                {item.children && (
                  <div className="mega-dropdown">
                    <div className="mega-content">
                      {item.children.map((child, childIndex) => (
                        <div key={childIndex} className="mega-column">
                          <Link to={child.path} className="mega-header">
                            {child.label}
                          </Link>
                          {child.children && (
                            <ul className="mega-sublist">
                              {child.children.map((sub, subIndex) => (
                                <li key={subIndex}>
                                  <Link to={sub.path} className="mega-sublink">
                                    {sub.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <button 
          className={`mobile-toggle ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
        >
          <span className="toggle-line"></span>
          <span className="toggle-line"></span>
        </button>
      </div>

      <div className={`mobile-dropdown ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-list">
          {menuItems.map((item, index) => (
            <li key={index} className="mobile-item">
              <div className="mobile-row">
                <Link to={item.path} className="mobile-link">
                  {item.label}
                </Link>
                {item.children && (
                  <button 
                    className={`mobile-expand ${activeSubmenu === index ? 'expanded' : ''}`}
                    onClick={(e) => {
                      e.preventDefault(); 
                      toggleSubmenu(index);
                    }}
                  >
                    +
                  </button>
                )}
              </div>
              
              {item.children && (
                <div className={`mobile-submenu ${activeSubmenu === index ? 'visible' : ''}`}>
                  {item.children.map((child, cIndex) => (
                    <div key={cIndex} className="mobile-subgroup">
                      <Link to={child.path} className="mobile-sub-header">
                        {child.label}
                      </Link>
                      {child.children && (
                        <div className="mobile-nested-links">
                          {child.children.map((sub, sIndex) => (
                            <Link key={sIndex} to={sub.path} className="mobile-nested-link">
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;