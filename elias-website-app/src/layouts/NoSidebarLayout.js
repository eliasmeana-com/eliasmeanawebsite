import React from 'react';
import '../styles/NoSidebarLayout.css';


function NoSidebarLayout({ children }) {
    return <div className="content">{children}</div>;
}

export default NoSidebarLayout;
