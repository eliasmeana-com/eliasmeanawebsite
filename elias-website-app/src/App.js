import React from 'react';
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import Schedule from './components/Schedule/Schedule'
import Dwave from './components/papers/Dwave';
import Research from './components/Research'
import Music from './components/Studio/Music'
import Trip from './components/TripGallery/TripGallery'
import SchoolHome from './components/SchoolPortal/SchoolHome'
import SomePage from './components/SchoolPortal/classnotes'
import AssignmentsHome from './components/SchoolPortal/assignmentsHome'
import SingleAssignment from './components/SchoolPortal/assignmentSingle'
import Blog from './components/Blog'
import Login from './API/AUTH/LoginPage'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Route with Sidebar */}
        <Route path="/resume" element={<SidebarLayout><Resume /></SidebarLayout>} />

        {/* Routes without Sidebar*/}
        <Route path="/birla" element={<NoSidebarLayout><Birla /></NoSidebarLayout>} />
        <Route path="/pel" element={<NoSidebarLayout><PEL /></NoSidebarLayout>} />
        <Route path="/blog" element={<NoSidebarLayout><Blog /></NoSidebarLayout>} />
        <Route path="/schedule" element={<RestrictedPage><Schedule /></RestrictedPage>} />
        <Route path="/schoolhome" element={<RestrictedPage><SchoolHome /></RestrictedPage>} />
        <Route path="/latexpage/classnotes/:classCode" element={<RestrictedPage><SomePage /></RestrictedPage>} />
        <Route path="/assignments/:classCode" element={<RestrictedPage><AssignmentsHome /></RestrictedPage>} />
        <Route path="/assignment/:classCode/:assignmentId" element={<RestrictedPage><SingleAssignment /></RestrictedPage>} />
        <Route path="/dwave" element={<NoSidebarLayout><Dwave /></NoSidebarLayout>} />
        <Route path="/research" element={<NoSidebarLayout><Research /></NoSidebarLayout>} />
        <Route path="/music" element={<NoSidebarLayout><Music /></NoSidebarLayout>} />
        <Route path="/" element={<NoSidebarLayout><Home /></NoSidebarLayout>} />
        <Route path="/trip" element={<NoSidebarLayout><Trip /></NoSidebarLayout>} />
        <Route path="/login" element={<NoSidebarLayout><Login /></NoSidebarLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
