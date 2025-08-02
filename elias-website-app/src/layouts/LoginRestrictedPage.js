import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import '../styles/NoSidebarLayout.css';

function RestrictedPage({ children }) {
  const token = localStorage.getItem('authToken');
  const location = useLocation();
  const currentPath = location.pathname;

  if (!token && !currentPath.startsWith('/login')) {
    const redirectPath = location.pathname + location.search;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectPath)}`} replace />;
  }

  return <div className="content">{children}</div>;
}

export default RestrictedPage;
