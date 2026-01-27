import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import SidebarLayout from './layouts/SidebarLayout';
import RestrictedPage from './layouts/LoginRestrictedPage';
import NoSidebarLayout from './layouts/NoSidebarLayout';
import Home from './components/Home';
import Resume from './components/Resume';
import './styles/App.css';
import Navbar from './components/Navbar';
import Birla from './components/papers/Birla';
import PEL from './components/papers/PEL';
import Schedule from './components/Schedule/Schedule';
import Dwave from './components/papers/Dwave';
import Research from './components/Research';
import Music from './components/Studio/Music';
import Trip from './components/TripGallery/TripGallery';
import SchoolHome from './components/SchoolPortal/SchoolHome';
import SomePage from './components/SchoolPortal/classnotes';
import AssignmentsHome from './components/SchoolPortal/assignmentsHome';
import SingleAssignment from './components/SchoolPortal/assignmentSingle';
import Login from './API/AUTH/LoginPage';
import BlogList from './components/Blog/BlogList';
import BlogPage from './components/Blog/BlogPage';
import BlogEditor from './components/Blog/BlogEditor';
import EditBlogPage from './components/Blog/EditBlogPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* 1. Sidebar Layout Group */}
        <Route path="/resume" element={<SidebarLayout><Resume /></SidebarLayout>} />

        {/* 2. Blog Ecosystem (Wrapped in NoSidebar for layout consistency) */}
        {/* General/Main List */}
        <Route path="/blogs" element={<NoSidebarLayout><BlogList /></NoSidebarLayout>} />
        
        {/* Categorized Lists (e.g., /blogs/politics) */}
        <Route path="/blogs/:subject" element={<NoSidebarLayout><BlogList /></NoSidebarLayout>} />
        
        {/* Single View */}
        <Route path="/blog/:id" element={<NoSidebarLayout><BlogPage /></NoSidebarLayout>} />
        
        {/* Admin Tools */}
        <Route path="/admin/create-blog" element={<NoSidebarLayout><BlogEditor /></NoSidebarLayout>} />
        <Route path="/admin/edit/:id" element={<NoSidebarLayout><EditBlogPage /></NoSidebarLayout>} />

        {/* 3. Restricted School Portal Group */}
        <Route path="/schedule" element={<RestrictedPage><Schedule /></RestrictedPage>} />
        <Route path="/schoolhome" element={<RestrictedPage><SchoolHome /></RestrictedPage>} />
        <Route path="/latexpage/classnotes/:classCode" element={<RestrictedPage><SomePage /></RestrictedPage>} />
        <Route path="/assignments/:classCode" element={<RestrictedPage><AssignmentsHome /></RestrictedPage>} />
        <Route path="/assignment/:classCode/:assignmentId" element={<RestrictedPage><SingleAssignment /></RestrictedPage>} />

        {/* 4. General "No Sidebar" Pages */}
        <Route path="/birla" element={<NoSidebarLayout><Birla /></NoSidebarLayout>} />
        <Route path="/pel" element={<NoSidebarLayout><PEL /></NoSidebarLayout>} />
        <Route path="/dwave" element={<NoSidebarLayout><Dwave /></NoSidebarLayout>} />
        <Route path="/research" element={<NoSidebarLayout><Research /></NoSidebarLayout>} />
        <Route path="/music" element={<NoSidebarLayout><Music /></NoSidebarLayout>} />
        <Route path="/trip" element={<NoSidebarLayout><Trip /></NoSidebarLayout>} />
        <Route path="/login" element={<NoSidebarLayout><Login /></NoSidebarLayout>} />
        
        {/* Landing Page */}
        <Route path="/" element={<NoSidebarLayout><Home /></NoSidebarLayout>} />
      </Routes>
    </Router>
  );
}

export default App;