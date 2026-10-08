import React from 'react';
import '../styles/Home.css';
import profileImg from './elias-profile-pic.png';

function Home() {
  return (
    <div className="home-wrapper">
      <div className="home-card">
        <header className="profile-header">
          <div className="image-cropper">
            <img src={profileImg} alt="Elias Meana" className="profile-pic" />
          </div>
          <h1 className="firstname">Elias Meana</h1>
          <p className="tagline">Application Engineer & Mathematics PhD Student</p>
        </header>

        <section className="bio-content">
          <p>
            I'm a mathematics PhD student and developer currently based in Spain. My research
            focuses on <strong>stochastic differential equations</strong> and{' '}
            <strong>numerical integration</strong>. 
          </p>
          <p>
            On the engineering side, I work as an application engineer building tools with
            Python, C#, and JavaScript. You can check out my{' '}
            <a
              href="https://github.com/eliasmeana132"
              target="_blank"
              rel="noreferrer"
              className="bio-link"
            >
              GitHub
            </a>.
          </p>
          <p>
            When I'm not working, I'm usually outside running or swimming,
            practicing languages, or writing music. I'm always happy to connect with others
            interested in the intersection of math and computing.
          </p>
          <p>
            I consider myself a dialectical materialist and you should too. 
          </p>
        </section>
      </div>

      <section id="contact" className="contact-section">
        <h2>Contact</h2>
        <div className="contact-grid">
          <div className="contact-item">
            <a href="mailto:your.email@example.com" className="btn-primary">
              Email Me
            </a>
          </div>
          <div className="contact-item">
            <strong>Other</strong>
            <div className="social-links">
              <a href="https://github.com/eliasmeana132">GitHub</a>
              <a href="https://www.linkedin.com/in/elias-meana-5206981ab/">LinkedIn</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
