import React from 'react';
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import SidebarLayout from './layouts/SidebarLayout';
import NoSidebarLayout from './layouts/NoSidebarLayout';
import Home from './components/Home';
import Resume from './components/Resume';
import './styles/App.css';
import Navbar from './components/Navbar';
import Birla from './components/Birla';
import Schedule from './components/Schedule/Schedule'
import Dwave from './components/Dwave';
import Research from './components/Research'
import Music from './components/Studio/Music'
import Trip from './components/TripGallery/TripGallery'
import SchoolHome from './components/SchoolPortal/SchoolHome'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Route with Sidebar */}
        <Route path="/resume" element={<SidebarLayout><Resume /></SidebarLayout>} />

        {/* Routes without Sidebar*/}
        <Route path="/birla" element={<NoSidebarLayout><Birla /></NoSidebarLayout>} />
        <Route path="/schedule" element={<NoSidebarLayout><Schedule /></NoSidebarLayout>} />
        <Route path="/schoolhome" element={<NoSidebarLayout><SchoolHome /></NoSidebarLayout>} />
        <Route path="/dwave" element={<NoSidebarLayout><Dwave /></NoSidebarLayout>} />
        <Route path="/research" element={<NoSidebarLayout><Research /></NoSidebarLayout>} />
        <Route path="/music" element={<NoSidebarLayout><Music /></NoSidebarLayout>} />
        <Route path="/" element={<NoSidebarLayout><Home /></NoSidebarLayout>} />
        <Route path="/trip" element={<NoSidebarLayout><Trip /></NoSidebarLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
