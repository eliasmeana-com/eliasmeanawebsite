import React from 'react';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home">
      <h1>Hi, I'm Elias</h1>
      
      {/* Bio Section */}
      <div className="bio">
        <h2>About Me</h2>
        <p>
          I'm Elias Meana, a person with a passion for blending creativity and logic. My journey through mathematics, physics, and computer engineering has taken me from the University of Georgia to Spain, where I dove deep into advanced studies and research. Today, I work as an application engineer, building web applications and tools using languages like Python, C#, JavaScript, and SQL.
        </p>
        <p>
          But it's not all code and equations for me. I'm an avid musician and composer. I thrive outdoors, whether it’s running, hiking, swimming, or anything else that presents itself. Fluent in several languages, I enjoy connecting with people and cultures, constantly seeking new experiences that challenge and inspire me.
        </p>
      </div>

      {/* <div className="home-links">
        <a href="#/resume" className="home-button">Resume</a>
        <a href="#education" className="home-button">Music</a>
        <a href="#/birla" className="home-button">eNos Poster</a>
      </div> */}
    </div>
  );
}

export default Home;
