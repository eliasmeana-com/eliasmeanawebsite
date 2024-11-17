// SidebarLayout.js
import React from 'react';
import Sidebar from '../components/Sidebar'; // Ensure the import path is correct
import '../styles/SidebarLayout.css'; // Import a layout-specific CSS file if needed

function SidebarLayout({ children }) {
  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        {children}
      </div>
    </div>
  );
}

export default SidebarLayout;
