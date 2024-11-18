import React from 'react';
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
                <span className="submenu-title">{item.title}</span>
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
  const birlaMenuItems = [
    // {
    //   title: 'Birla Main',
    //   link: '/birla-main',
    // },
    {
      title: 'Research',
      submenu: [
        { title: 'Birla Poster', link: '/birla' },
        { title: 'Subitem 2', link: '/subitem-2' },
      ],
    },
    {
      title: 'Submenu 2',
      submenu: [
        { title: 'Subitem A', link: '/subitem-a' },
        { title: 'Subitem B', link: '/subitem-b' },
      ],
    },
  ];

  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/resume">Resume</Link></li>
        <Dropdown title="Other Stuff" items={birlaMenuItems} />
      </ul>
    </nav>
  );
}

export default Navbar;
