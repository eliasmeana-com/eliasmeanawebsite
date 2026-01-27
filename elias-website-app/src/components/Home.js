import React from 'react';
import '../styles/Home.css';
import profileImg from './elias-profile-pic.png';
import LatexDocumentRenderer from '../utils/latexUtils/LatexDocumentRenderer';

function Home() {
  const mathBio = `
\\begin{equation*}
\\mathcal{L}^2_{\\rm SP}(\\Omega) = \\left\\{ X : T \\times \\Omega \\to \\mathbb{R} \\mid \\int_T \\mathbb{E}[X(t)^2] dt < \\infty \\right\\}.
\\end{equation*}
  `;
  return (
    <div className="home-wrapper">
      <div className="home-card">
        <header className="profile-header">
          <div className="image-cropper">
            <img src={profileImg} alt="Elias Meana" className="profile-pic" />
          </div>
          <h1 className='firstname'>Elias Meana</h1>
          <p className="tagline">Application Engineer & Math Graduate Student</p>
        </header>

        <section className="bio-content">
          <p>
            I’m a developer and student currently based in Spain, where I'm diving deep into
            <strong> functional analysis</strong> and <strong>stochastic differential equations</strong>.
            I'm currently working on studying the properties of solutions to the stochastic wave equation
            in the space of mean square convergent stochastic processes:
            <div className="math-container">
            <LatexDocumentRenderer latexScript={mathBio} />
          </div>
          
          </p>
          <p>
            On the engineering side, I work as an application engineer building tools with
            Python, C#, and JavaScript. Most recently, I've been working on developing
            <code>difusion_lib</code>, a library for simulating diffusion on graphs, and
            experimenting with network analysis and scrapers. You can check out my
            <a href="https://eliasmeana132-difusion-en-grafos-app-refactor-app-jvzhvp.streamlit.app/#graph-diffusion-simulator" target="_blank" rel="noreferrer" className="bio-link"> Graph Diffusion Simulator</a>
            as well as my <a href="https://github.com/eliasmeana132" target="_blank" rel="noreferrer" className="bio-link">GitHub</a>.
          </p>
          <p>
            I'm also a voracious reader and political organizer. I firmly believe in the power of the
            working class, and am determined to live to see a free Palestine 🇵🇸.
          </p>
          <p>
            When I'm not working or organizing, I'm usually outside running or swimming,
            practicing languages, or writing music. I’m always happy to connect with others
            interested in the intersection of math and computing.
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