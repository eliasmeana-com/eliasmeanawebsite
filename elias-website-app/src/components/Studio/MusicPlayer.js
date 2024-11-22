import React, { useState, useEffect, useRef } from 'react';
import { Howl, Howler } from 'howler';
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from 'react-icons/fa';
import '../../styles/MusicPlayer.css';

const songs = require.context('../../Music', false, /\.mp3$/);
const songPaths = songs.keys().map(song => ({
  title: song.replace('./', '').replace('.mp3', ''),
  url: songs(song),
}));

const MusicPlayer = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sound, setSound] = useState(null);

  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const currentTrack = songPaths[currentTrackIndex];

  useEffect(() => {
    if (sound) {
      sound.unload();
    }

    const newSound = new Howl({
      src: [currentTrack.url],
      html5: true,
      onend: handleNext,
      onload: () => setDuration(newSound.duration()),
    });

    setSound(newSound);
    setProgress(0);
    if (isPlaying) newSound.play();


    return () => {
      newSound.unload();
      cancelAnimationFrame(animationRef.current);
    };
  }, [currentTrackIndex]);

  const handlePlayPause = () => {
    if (!sound) return;

    if (isPlaying) {
      sound.pause();
      cancelAnimationFrame(animationRef.current);
    } else {
      sound.play();
      updateProgress();
    }

    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((currentTrackIndex + 1) % songPaths.length);
    setIsPlaying(false);
  };

  const handlePrevious = () => {
    setCurrentTrackIndex(
      (currentTrackIndex - 1 + songPaths.length) % songPaths.length
    );
    setIsPlaying(false);
  };

  const updateProgress = () => {
    if (sound && isPlaying) {
      setProgress(sound.seek());
      animationRef.current = requestAnimationFrame(updateProgress);
    }
  };

  const handleSeek = (value) => {
    if (sound) {
      sound.seek((value / 100) * duration);
      setProgress((value / 100) * duration);
    }
  };

  // Waveform visualizer setup (commented out)
  // const setupWaveformVisualizer = (soundInstance) => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext('2d');
  //   const analyser = Howler.ctx.createAnalyser();
  //   const source = Howler.ctx.createMediaElementSource(soundInstance._sounds[0]._node);

  //   source.connect(analyser);
  //   analyser.connect(Howler.ctx.destination);
  //   analyser.fftSize = 512;

  //   const bufferLength = analyser.frequencyBinCount;
  //   const dataArray = new Uint8Array(bufferLength);

  //   const drawWaveform = () => {
  //     analyser.getByteFrequencyData(dataArray);

  //     ctx.clearRect(0, 0, canvas.width, canvas.height);
  //     ctx.fillStyle = '#222';
  //     ctx.fillRect(0, 0, canvas.width, canvas.height);

  //     const barWidth = (canvas.width / bufferLength) * 2.5;
  //     let x = 0;

  //     for (let i = 0; i < bufferLength; i++) {
  //       const barHeight = dataArray[i] / 2;
  //       ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
  //       ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
  //       x += barWidth + 1;
  //     }

  //     animationRef.current = requestAnimationFrame(drawWaveform);
  //   };

  //   drawWaveform();
  // };

  return (
    <div className="music-player">
      <h2 className="track-title">{currentTrack.title}</h2>

      {/* Waveform Visualizer (commented out) */}
      {/* <canvas ref={canvasRef} className="waveform" width="500" height="100" /> */}

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <input
          type="range"
          className="progress-bar"
          min="0"
          max="100"
          value={(progress / duration) * 100 || 0}
          onChange={(e) => handleSeek(e.target.value)}
        />
      </div>

      {/* Controls */}
      <div className="controls">
        <button onClick={handlePrevious} className="control-button">
          <FaStepBackward />
        </button>
        <button onClick={handlePlayPause} className="control-button">
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button onClick={handleNext} className="control-button">
          <FaStepForward />
        </button>
      </div>

      {/* Track List */}
      <ul className="track-list">
        {songPaths.map((song, index) => (
          <li
            key={song.title}
            className={`track-item ${
              index === currentTrackIndex ? 'active-track' : ''
            }`}
            onClick={() => setCurrentTrackIndex(index)}
          >
            {song.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MusicPlayer;
