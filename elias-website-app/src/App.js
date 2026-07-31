import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import SidebarLayout from './layouts/SidebarLayout';
import RestrictedPage from './layouts/LoginRestrictedPage';
import NoSidebarLayout from './layouts/NoSidebarLayout';
import Home from './components/Home';
import Resume from './components/Resume';
import './styles/App.css';
import Navbar from './components/Navbar';
import PaperViewer from './components/papers/PaperViewer';
import Schedule from './components/Schedule/Schedule';
import Research from './components/Research';
import Music from './components/Studio/Music';
import Trip from './components/TripGallery/TripGallery';
import Pics from './components/Pics/Pics';
import PicsAlbum from './components/Pics/PicsAlbum';
import SchoolHome from './components/SchoolPortal/SchoolHome';
import SomePage from './components/SchoolPortal/classnotes';
import AssignmentsHome from './components/SchoolPortal/assignmentsHome';
import SingleAssignment from './components/SchoolPortal/assignmentSingle';
import Login from './API/AUTH/LoginPage';
import BlogList from './components/Blog/BlogList';
import BlogPage from './components/Blog/BlogPage';
import BlogEditor from './components/Blog/BlogEditor';
import EditBlogPage from './components/Blog/EditBlogPage';
import CloudManager from './components/Cloud/CloudManager';
import Sportsite from './components/Sportsite';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* 1. Sidebar Layout Group */}
        <Route path="/resume" element={<SidebarLayout><Resume /></SidebarLayout>} />

        {/* 2. Blog Ecosystem */}
        <Route path="/blogs" element={<NoSidebarLayout><BlogList /></NoSidebarLayout>} />
        <Route path="/blogs/:subject" element={<NoSidebarLayout><BlogList /></NoSidebarLayout>} />
        <Route path="/blog/:id" element={<NoSidebarLayout><BlogPage /></NoSidebarLayout>} />
        <Route path="/admin/create-blog" element={<NoSidebarLayout><BlogEditor /></NoSidebarLayout>} />
        <Route path="/admin/edit/:id" element={<NoSidebarLayout><EditBlogPage /></NoSidebarLayout>} />
        <Route path="/cloud" element={<NoSidebarLayout><CloudManager /></NoSidebarLayout>} />

        {/* 3. Restricted School Portal Group */}
        <Route path="/schedule" element={<RestrictedPage><Schedule /></RestrictedPage>} />
        <Route path="/schoolhome" element={<RestrictedPage><SchoolHome /></RestrictedPage>} />
        <Route path="/latexpage/classnotes/:classCode" element={<RestrictedPage><SomePage /></RestrictedPage>} />
        <Route path="/assignments/:classCode" element={<RestrictedPage><AssignmentsHome /></RestrictedPage>} />
        <Route path="/assignment/:classCode/:assignmentId" element={<RestrictedPage><SingleAssignment /></RestrictedPage>} />
        <Route path="/sportsite" element={<RestrictedPage><Sportsite /></RestrictedPage>} />

        {/* 4. General "No Sidebar" Pages */}
        <Route path="/paper/:slug" element={<NoSidebarLayout><PaperViewer /></NoSidebarLayout>} />
        <Route path="/research" element={<NoSidebarLayout><Research /></NoSidebarLayout>} />
        <Route path="/music" element={<NoSidebarLayout><Music /></NoSidebarLayout>} />
        <Route path="/trip" element={<NoSidebarLayout><Trip /></NoSidebarLayout>} />
        <Route path="/travel" element={<NoSidebarLayout><Pics /></NoSidebarLayout>} />
        <Route path="/travel/:albumId" element={<NoSidebarLayout><PicsAlbum /></NoSidebarLayout>} />
        <Route path="/pics" element={<NoSidebarLayout><Pics /></NoSidebarLayout>} />
        <Route path="/pics/:albumId" element={<NoSidebarLayout><PicsAlbum /></NoSidebarLayout>} />
        <Route path="/login" element={<NoSidebarLayout><Login /></NoSidebarLayout>} />

        {/* Landing Page */}
        <Route path="/" element={<NoSidebarLayout><Home /></NoSidebarLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
