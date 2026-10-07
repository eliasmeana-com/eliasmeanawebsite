import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaMusic } from 'react-icons/fa';
import { useMusic, formatTime } from '../../context/MusicContext';
import '../../styles/MiniPlayer.css';

const MiniPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    hasTrack,
    toggle,
    next,
    previous,
  } = useMusic();
  const location = useLocation();

  // Hide the mini player on the full music page (the full player is there)
  if (location.pathname === '/music') return null;
  if (!hasTrack) return null;

  const progressPct = duration ? (progress / duration) * 100 : 0;

  return (
    <div className="mini-player">
      <div className="mini-progress" style={{ width: `${progressPct}%` }} />

      <div className="mini-content">
        <Link to="/music" className="mini-track">
          {currentTrack.cover ? (
            <img src={currentTrack.cover} alt="" className="mini-cover" />
          ) : (
            <span className="mini-cover mini-cover-fallback"><FaMusic /></span>
          )}
          <div className="mini-meta">
            <span className="mini-title">{currentTrack.title}</span>
            <span className="mini-time">{formatTime(progress)} / {formatTime(duration)}</span>
          </div>
        </Link>

        <div className="mini-controls">
          <button className="mini-btn" onClick={previous} aria-label="Previous">
            <FaStepBackward />
          </button>
          <button className="mini-btn mini-btn-primary" onClick={toggle} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button className="mini-btn" onClick={next} aria-label="Next">
            <FaStepForward />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
