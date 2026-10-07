import React from "react";
import MusicPlayer from "./MusicPlayer";
import StudioImages from "./StudioImages";
import '../../styles/music.css';
import { useMusic } from '../../context/MusicContext';

const App = () => {
  const { currentTrack } = useMusic();

  return (
    <div className="music-page-container">
      <div className="music-background-blur"></div>
      {currentTrack.cover && (
        <div className="album-art-bg" aria-hidden="true">
          <img src={currentTrack.cover} alt="" className="album-art-bg-img" />
        </div>
      )}
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
