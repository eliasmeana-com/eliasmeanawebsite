import React from "react";
import MusicGallery from "./MusicGallery";
import StudioImages from "./StudioImages";

const App = () => {
  return (
    <div className="app-container">
      <h1>Welcome to My Music Showcase</h1>
      <MusicGallery />
      <StudioImages />
    </div>
  );
};

export default App;
