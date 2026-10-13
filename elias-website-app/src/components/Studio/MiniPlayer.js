import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaMusic, FaTimes, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { useMusic, formatTime } from '../../context/MusicContext';
import '../../styles/MiniPlayer.css';

const MiniPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    hasPlayed,
    dismissed,
    volume,
    muted,
    toggle,
    next,
    previous,
    dismissMini,
    changeVolume,
    toggleMute,
  } = useMusic();
  const location = useLocation();

  if (location.pathname === '/music') return null;
  if (!hasPlayed || dismissed) return null;

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

          <div className="mini-volume">
            <button className="mini-btn" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
              {muted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            <input
              type="range"
              className="mini-volume-slider"
              min="0"
              max="1"
              step="0.01"
              value={muted ? 0 : volume}
              onChange={(e) => changeVolume(parseFloat(e.target.value))}
              aria-label="Volume"
              style={{ backgroundSize: `${(muted ? 0 : volume) * 100}% 100%` }}
            />
          </div>

          <button className="mini-btn mini-btn-close" onClick={dismissMini} aria-label="Close player">
            <FaTimes />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
