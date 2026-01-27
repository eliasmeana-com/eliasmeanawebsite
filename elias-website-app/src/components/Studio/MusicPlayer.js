import React, { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaMusic } from 'react-icons/fa';
import '../../styles/MusicPlayer.css';

const musicReq = require.context('../../Music', false, /\.mp3$/);

const imageReq = require.context('../../Music', false, /\.(png|jpe?g)$/);

const songPaths = musicReq.keys().map(songKey => {
  const baseName = songKey.replace('./', '').replace('.mp3', '');
  
  let coverUrl = null;
  const possibleImages = [`./${baseName}.jpg`, `./${baseName}.jpeg`, `./${baseName}.png`];
  
  for (const imgPath of possibleImages) {
    if (imageReq.keys().includes(imgPath)) {
      coverUrl = imageReq(imgPath);
      break;
    }
  }

  return {
    title: baseName,
    url: musicReq(songKey),
    cover: coverUrl, 
  };
});

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

const Visualizer = ({ isPlaying }) => (
  <div className={`visualizer-container ${isPlaying ? 'active' : ''}`}>
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bar"></div>
    ))}
  </div>
);

const MusicPlayer = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sound, setSound] = useState(null);
  
  const animationRef = useRef(null);
  const currentTrack = songPaths[currentTrackIndex];

  useEffect(() => {
    if (sound) sound.unload();

    const newSound = new Howl({
      src: [currentTrack.url],
      html5: true,
      onend: handleNext,
      onload: () => setDuration(newSound.duration()),
      onplay: () => requestAnimationFrame(updateProgress),
    });

    setSound(newSound);
    setProgress(0);
    
    if (isPlaying) {
      newSound.play();
    }

    return () => {
      newSound.unload();
      cancelAnimationFrame(animationRef.current);
    };
  }, [currentTrackIndex]);

  const updateProgress = () => {
    if (sound && sound.playing()) {
      setProgress(sound.seek());
      animationRef.current = requestAnimationFrame(updateProgress);
    }
  };

  const handlePlayPause = () => {
    if (!sound) return;
    if (isPlaying) {
      sound.pause();
      cancelAnimationFrame(animationRef.current);
    } else {
      sound.play();
      requestAnimationFrame(updateProgress);
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % songPaths.length);
  };

  const handlePrevious = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + songPaths.length) % songPaths.length);
  };

  const handleSeek = (e) => {
    const value = parseFloat(e.target.value);
    if (sound) {
      sound.seek(value);
      setProgress(value);
    }
  };

  return (
    <div className="player-wrapper">
      <div className="player-main"> 
        <div className="album-art">
          {currentTrack.cover ? (
             <img src={currentTrack.cover} alt="Album Art" className="cover-image" />
          ) : (
             <FaMusic className="default-icon" />
          )}
          <Visualizer isPlaying={isPlaying} />
          {currentTrack.cover && <div className="art-overlay"></div>}
        </div>

        <div className="track-info">
          <h3>{currentTrack.title}</h3>
          <span className="artist-label">Original Composition</span>
        </div>

        <div className="progress-area">
          <div className="time-stamps">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            className="seek-slider"
            min="0"
            max={duration || 0}
            step="0.1"
            value={progress}
            onChange={handleSeek}
            style={{
              backgroundSize: `${(progress / duration) * 100}% 100%`
            }}
          />
        </div>

        <div className="controls-row">
          <button className="ctrl-btn secondary" onClick={handlePrevious}>
            <FaStepBackward />
          </button>
          <button className={`ctrl-btn primary ${isPlaying ? 'playing' : ''}`} onClick={handlePlayPause}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button className="ctrl-btn secondary" onClick={handleNext}>
            <FaStepForward />
          </button>
        </div>
      </div>

      <div className="playlist-side">
        <h4>Up Next</h4>
        <ul className="song-list">
          {songPaths.map((song, index) => (
            <li
              key={index}
              className={`song-item ${index === currentTrackIndex ? 'active' : ''}`}
              onClick={() => {
                setCurrentTrackIndex(index);
                setIsPlaying(true);
              }}
            >
              <div className="song-index">
                {song.cover && index !== currentTrackIndex ? (
                   <img src={song.cover} alt="" style={{width: '25px', borderRadius: '4px'}}/>
                ) : (
                   index + 1
                )}
              </div>
              <div className="song-details">
                <span className="song-name">{song.title}</span>
              </div>
              {index === currentTrackIndex && isPlaying && (
                <div className="mini-equalizer">
                  <span></span><span></span><span></span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MusicPlayer;