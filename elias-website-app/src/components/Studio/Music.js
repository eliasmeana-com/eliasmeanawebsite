import React from "react";
import MusicPlayer from "./MusicPlayer";
import StudioImages from "./StudioImages";
import '../../styles/music.css';

const App = () => {
  return (
    <div className="music-page-container">
      <div className="music-background-blur"></div>
      <div className="music-content-wrapper">
        <header className="music-header">
          <h1>Music</h1>
          <p>Some of my compositions and experiments</p>
        </header>
        
        <MusicPlayer />
        
        <div className="studio-section">
          <h2>The Studio</h2>
          <StudioImages />
        </div>
      </div>
    </div>
  );
};

export default App;