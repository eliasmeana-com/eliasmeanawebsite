import React from 'react';
import '../styles/SidebarLayout.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <h1 className="sidebar-name">Elias Meana</h1>
      <div className="sidebar-section">
        <p className="sidebar-label">Email</p>
        <a href="mailto:eliasmeana132@gmail.com">eliasmeana132@gmail.com</a>
      </div>
      <div className="sidebar-section">
        <p className="sidebar-label">US Phone</p>
        <p className="sidebar-value">+1 (404)-918-6735</p>
      </div>
      <div className="sidebar-section">
        <p className="sidebar-label">Spanish Phone</p>
        <p className="sidebar-value">+34 653 595 186</p>
      </div>

      <h1 className="sidebar-heading">Links</h1>
      <p><a href="https://www.linkedin.com/in/elias-meana-5206981ab/" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
      <p><a href="https://github.com/eliasmeana132/" target="_blank" rel="noopener noreferrer">Github</a></p>
    </div>
  );
}

export default Sidebar;
