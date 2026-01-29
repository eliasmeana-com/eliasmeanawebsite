import React, { useState, useEffect, useRef } from 'react';
import { Howl, Howler } from 'howler';
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

const Visualizer = ({ isPlaying }) => {
  const barsRef = useRef([]);
  const analyserRef = useRef(null);

  // --- CONFIGURATION ---
  const TOTAL_BARS = 40; 
  const CENTER_FREQ = 1000; 
  const OCTAVE_WIDTH = 4; 

  // 1. SAFE INITIALIZATION
  // We wait until 'isPlaying' is true to ensure Howler.ctx is ready.
  useEffect(() => {
    // Stop if we are not playing, if it's already set up, or if Howler isn't ready.
    if (!isPlaying || analyserRef.current || !Howler.ctx) return;

    try {
      const ctx = Howler.ctx; 
      const analyser = ctx.createAnalyser();
      
      analyser.fftSize = 4096; 
      analyser.smoothingTimeConstant = 0.85; 
      
      Howler.masterGain.connect(analyser);
      analyserRef.current = analyser;
    } catch (e) {
      console.warn("Audio Context not ready yet:", e);
    }
  }, [isPlaying]);

  // 2. ANIMATION LOOP
  useEffect(() => {
    let animationId;
    
    // If the analyser isn't ready yet, don't try to run the loop logic
    if (!analyserRef.current || !Howler.ctx) return;

    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    // Calculate frequency bounds based on your settings
    const lowerFreq = CENTER_FREQ / Math.pow(2, OCTAVE_WIDTH / 2);
    const upperFreq = CENTER_FREQ * Math.pow(2, OCTAVE_WIDTH / 2);

    // Pre-calculate the index map
    const indexMap = [];
    const sampleRate = Howler.ctx.sampleRate; 
    const binSize = sampleRate / analyser.fftSize; 

    for (let i = 0; i < TOTAL_BARS; i++) {
      const fraction = i / (TOTAL_BARS - 1);
      const targetFreq = lowerFreq * Math.pow(upperFreq / lowerFreq, fraction);
      const binIndex = Math.round(targetFreq / binSize);
      indexMap.push(binIndex);
    }

    const renderFrame = () => {
      // If stopped or analyzer not ready, reset bars to flat
      if (!isPlaying || !analyserRef.current) {
        barsRef.current.forEach(bar => {
          if (bar) bar.style.transform = 'scaleY(0.1)';
        });
        return; 
      }

      analyser.getByteFrequencyData(dataArray);

      barsRef.current.forEach((bar, i) => {
        if (!bar) return;

        const index = indexMap[i];
        
        // Safety check
        const safeIndex = Math.min(index, dataArray.length - 1);
        
        // Normalize 0-255 to 0.0-1.0
        let value = dataArray[safeIndex] / 255;

        // "Pink Noise" Compensation
        const trebleBoost = 1 + (i / TOTAL_BARS); 
        value = value * trebleBoost;

        const height = Math.max(0.1, Math.min(1, value));
        bar.style.transform = `scaleY(${height})`;
      });

      animationId = requestAnimationFrame(renderFrame);
    };

    if (isPlaying) {
      renderFrame();
    } else {
      cancelAnimationFrame(animationId);
      barsRef.current.forEach(bar => {
         if (bar) bar.style.transform = 'scaleY(0.1)';
      });
    }

    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, CENTER_FREQ, OCTAVE_WIDTH]);

  return (
    <div className={`visualizer-container ${isPlaying ? 'active' : ''}`}>
      {[...Array(TOTAL_BARS)].map((_, i) => (
        <div 
          key={i} 
          className="bar"
          ref={el => barsRef.current[i] = el}
        ></div>
      ))}
    </div>
  );
};

const MusicPlayer = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // 1. We keep 'sound' in state for UI updates, but use a Ref for logic
  const [sound, setSound] = useState(null);
  const soundRef = useRef(null); 
  
  const animationRef = useRef(null);
  const currentTrack = songPaths[currentTrackIndex];

  // 2. This function now looks at soundRef.current (which is always up to date)
  const updateProgress = () => {
    if (soundRef.current && soundRef.current.playing()) {
      setProgress(soundRef.current.seek());
      animationRef.current = requestAnimationFrame(updateProgress);
    }
  };

  useEffect(() => {
    // Cleanup previous sound using the Ref
    if (soundRef.current) {
      soundRef.current.unload();
    }
    
    // Stop any running animation frame to prevent conflicts
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const newSound = new Howl({
      src: [currentTrack.url],
      html5: false,
      onend: handleNext,
      onload: () => setDuration(newSound.duration()),
      onplay: () => {
        // Start the loop
        animationRef.current = requestAnimationFrame(updateProgress);
      },
    });

    // 3. Update both the Ref (immediate) and State (trigger render)
    soundRef.current = newSound;
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

  const handlePlayPause = () => {
    // Use Ref for logic
    if (!soundRef.current) return;

    if (isPlaying) {
      soundRef.current.pause();
      cancelAnimationFrame(animationRef.current);
    } else {
      soundRef.current.play();
      animationRef.current = requestAnimationFrame(updateProgress);
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
    // Use Ref for logic
    if (soundRef.current) {
      soundRef.current.seek(value);
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
          <span className="artist-label">Elias Meana</span>
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