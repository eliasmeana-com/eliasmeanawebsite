import React, { useEffect, useState, useRef } from 'react';
import heic2any from 'heic2any';
import { BASE_URL } from '../../API/baseUrl';
import '../../styles/Cloud.css'; 

export default function FileViewer({ file, onClose }) {
  const fileUrl = `${BASE_URL}/api/cloud/file/${file.filename}`;
  const ext = file.filename.split('.').pop().toLowerCase();
  
  // HEIC State
  const [heicUrl, setHeicUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (ext === 'heic') {
        convertHeic();
    }
  }, [file]);

  const convertHeic = async () => {
      setLoading(true);
      setError(null);
      try {
          const token = localStorage.getItem('authToken');
          const res = await fetch(fileUrl, {
              headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
          
          let blob = await res.blob();
          if (blob.size === 0) throw new Error("File is empty");

          if (blob.type !== 'image/heic' && blob.type !== 'image/heif') {
              blob = blob.slice(0, blob.size, "image/heic");
          }
          
          const convertedBlob = await heic2any({
              blob,
              toType: "image/jpeg",
          });

          const finalBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
          const url = URL.createObjectURL(finalBlob);
          setHeicUrl(url);
      } catch (err) {
          console.error("HEIC Conversion Failed:", err);
          setError(err.message || "Format not supported");
      } finally {
          setLoading(false);
      }
  };

  // --- AUDIO HANDLERS ---
  const togglePlay = () => {
      if (audioRef.current) {
          if (isPlaying) audioRef.current.pause();
          else audioRef.current.play();
          setIsPlaying(!isPlaying);
      }
  };

  const handleTimeUpdate = () => {
      if (audioRef.current) {
          const current = audioRef.current.currentTime;
          const total = audioRef.current.duration;
          setCurrentTime(current);
          setDuration(total || 0);
          setProgress((current / total) * 100);
      }
  };

  const handleSeek = (e) => {
      const newTime = (e.target.value / 100) * duration;
      audioRef.current.currentTime = newTime;
      setProgress(e.target.value);
  };

  const formatTime = (time) => {
      if (!time) return "0:00";
      const min = Math.floor(time / 60);
      const sec = Math.floor(time % 60);
      return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const renderContent = () => {
    // IMAGES
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      return <img src={fileUrl} alt={file.filename} className="viewer-content-img" />;
    }

    // HEIC
    if (ext === 'heic') {
        if (loading) return <div className="loading-spinner">Converting HEIC...</div>;
        if (heicUrl) return <img src={heicUrl} alt={file.filename} className="viewer-content-img" />;
        return (
            <div className="unsupported-wrapper">
                <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🖼️</div>
                <h3>Preview Unavailable</h3>
                <div style={{fontSize:'0.8rem', color: '#555', marginBottom:'20px'}}>Error: {error}</div>
                <a href={fileUrl} download className="viewer-btn">Download Original</a>
            </div>
        );
    }
    
    // VIDEO
    if (['mp4', 'webm', 'mov'].includes(ext)) {
      return (
        <video controls className="viewer-content-media" autoPlay playsInline>
          <source src={fileUrl} />
          Your browser does not support video.
        </video>
      );
    }
    
    // CUSTOM AUDIO PLAYER
    if (['mp3', 'wav', 'ogg'].includes(ext)) {
      return (
        <div className="custom-audio-player">
            <div className="audio-icon-large">🎵</div>
            <audio 
                ref={audioRef} 
                src={fileUrl} 
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
            />
            
            <div className="audio-controls-bar">
                <button onClick={togglePlay} className="play-btn">
                    {isPlaying ? '⏸' : '▶'}
                </button>
                
                <span className="time-text">{formatTime(currentTime)}</span>
                
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={progress || 0} 
                    onChange={handleSeek}
                    className="seek-slider"
                />
                
                <span className="time-text">{formatTime(duration)}</span>
            </div>
        </div>
      );
    }
    
    // PDF & TEXT
    if (['pdf', 'txt', 'html', 'css', 'js', 'json'].includes(ext)) {
        return <iframe src={fileUrl} className="viewer-content-pdf" title="Viewer"></iframe>;
    }

    return (
        <div className="unsupported-wrapper">
            <p>Preview not available for this file type.</p>
        </div>
    );
  };

  return (
    <div className="viewer-overlay" onClick={onClose}>
      <div className="viewer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="viewer-header">
          <span className="viewer-title">{file.filename}</span>
          <div className="viewer-controls">
            {ext === 'heic' && heicUrl && (
                <a href={heicUrl} download={`${file.filename.split('.')[0]}.jpg`} className="viewer-btn">Save as JPG</a>
            )}
            <a href={fileUrl} download className="viewer-btn">
                {ext === 'heic' ? 'Original' : 'Download'}
            </a>
            <button onClick={onClose} className="viewer-btn close">×</button>
          </div>
        </div>
        <div className="viewer-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}