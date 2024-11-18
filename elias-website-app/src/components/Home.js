import React from 'react';

function Home() {
  return (
    <div className="home">
      <h1>Welcome to My Website</h1>
      <p>Explore my projects, skills, and professional journey.</p>
      <div className="home-links">
        <a href="#/resume" className="home-button">Resume</a>
        <a href="#education" className="home-button">Music</a>
        <a href="#/birla" className="home-button">eNos Poster</a>
      </div>
    </div>
  );
}

export default Home;
