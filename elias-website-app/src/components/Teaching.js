import React, { useState } from 'react';
import '../styles/Teaching.css';

const videos = [
  {
    id: 'qZeBoLYRdtA',
    title: 'Dynamics: Solving a classic mechanics problem involving inclined planes and pulleys',
  },
  {
    id: 'kyCsHftxT0Y',
    title: 'Series on Deriving Centers of Mass With Integral Formulations',
  },
  {
    id: 'ts_g7ADxP50',
    title: 'Solving Second Order Homogeneous Differential Equations',
  },
  {
    id: 'OAiHkcCSgf0',
    title: 'Solving First Order Nonhomogeneous Differential Equations With Integrating Factors',
  },
  {
    id: 'kkxi3G2PPnU',
    title: 'Intuitive Development of the Second Derivative Test',
  },
  {
    id: 'iTtU6JtLnVY',
    title: 'Intuitive Development of the Fundamental Theorem of Calculus',
  },
  {
    id: 'XcaFvFer4Hk',
    title: 'Introduction to Complex Numbers: From Edexcel AS Further Mathematics',
  },
  {
    id: 'elIe2A4WP3k',
    title: 'Telescoping Series and the Method of Differences: From Edexcel A2 Further Mathematics',
  },
];

function Teaching() {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <div className="teaching-page">
      <div className="teaching-hero">
        <h1>Teaching</h1>
        <p className="teaching-subtitle">
          Notes, lessons, and resources from years in the classroom
        </p>
      </div>

      <div className="teaching-content">
        <section className="teaching-intro">
          <p>
            I taught mathematics and computer science at the secondary level for
            several years, serving as the lead teacher for A-Level Mathematics and
            Further Mathematics. Here I collect the videos, explanations, and
            materials I've produced — designed to build intuition before technique.
          </p>
        </section>

        <a
          className="calc3-banner"
          href="https://eliasmeana132.github.io/Visual-Calc-3/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="calc3-banner-icon" aria-hidden="true">∇</div>
          <div className="calc3-banner-body">
            <h2>Visual Calc 3</h2>
            <p>Interactive visualizations covering all of multivariable calculus.</p>
          </div>
          <span className="calc3-banner-cta">Open visualizer ↗</span>
        </a>

        <h2 className="teaching-section-title">Video Lessons</h2>
        <div className="teaching-grid">
          {videos.map((video) => (
            <button
              key={video.id}
              className="teaching-card"
              onClick={() => setActiveVideo(video)}
              type="button"
            >
              <div className="teaching-thumb">
                <img
                  src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                  alt={video.title}
                />
                <span className="teaching-play">▶</span>
              </div>
              <div className="teaching-card-body">
                <h3>{video.title}</h3>
              </div>
            </button>
          ))}
        </div>

        <section className="teaching-placeholder">
          <div className="teaching-placeholder-inner">
            <h2>More coming soon</h2>
            <p>
              This page will grow into a full library of teaching resources —
              worksheets, lecture notes, and guided problem sets across calculus,
              differential equations, and further mathematics.
            </p>
          </div>
        </section>
      </div>

      {activeVideo && (
        <div className="video-modal-backdrop" onClick={() => setActiveVideo(null)}>
          <div className="video-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="video-modal-close"
              onClick={() => setActiveVideo(null)}
              aria-label="Close video"
            >
              &times;
            </button>
            <div className="video-modal-frame">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
                title={activeVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="video-modal-title">
              <h3>{activeVideo.title}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teaching;
