import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Dropdown({ title, items }) {
  return (
    <li className="dropdown">
      <span className="dropdown-title">
        {items.link ? (<Link to={items.link}>{items.title}</Link>) : (items.title)}
      </span>
      {items.submenu && (
        <ul className="dropdown-menu">
          {items.submenu.map((item, index) => (
            <li key={index} className="dropdown-item">
              {item.submenu ? (
                <>
                  <span className="dropdown-item-title">
                    {item.link ? (<Link to={item.link}>{item.title}</Link>) : (item.title)}
                  </span>
                  <ul className="submenu">
                    {item.submenu.map((subitem, subIndex) => (
                      <li key={subIndex} className="submenu-item">
                        <span>{subitem.link ? (<Link to={subitem.link}>{subitem.title}</Link>) : (subitem.title)}</span>
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
      )}
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
      title: 'Other Stuff',
      submenu: [
        {
          title: 'Research',
          link: '/research',
          submenu: [
            { title: 'Peeling Method', link: '/pel' },
            { title: 'Birla Poster', link: '/birla' },
            { title: 'D-wave Proposal', link: '/dwave' }
          ],
        },
        {
          title: 'Music',
          link: '/music'
        },
        {
          title: 'Trip',
          link: '/trip'
        },
        {
          title: 'Schedule',
          link: '/schedule'
        },
        {
          title: 'Class Home',
          link: '/schoolhome'
        }
      ]
    }
  ];
  const login = !!(localStorage.authToken) ? 'Logout' : 'Login';
  console.log(login)

  return (
    <nav className="navbar">
      <div className="navbar-header">
        <button className="hamburger" onClick={toggleMobileMenu}>
          &#9776;
        </button>
        <ul className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/resume">Resume</Link></li>
          <Dropdown title="Other Stuff" items={birlaMenuItems[0]} />
          <li><Link to="/blog">Blog</Link></li>
          <li><Link to="/login">{login}</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
