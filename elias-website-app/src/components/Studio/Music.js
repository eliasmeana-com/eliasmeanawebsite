import React from "react";
// import MusicGallery from "./MusicGallery";
import MusicPlayer from "./MusicPlayer"
import StudioImages from "./StudioImages";

const App = () => {
  return (
    <div>
      <h1>Welcome to My Music Showcase</h1>
      <MusicPlayer />
      <StudioImages />
    </div>
  );
};

export default App;
