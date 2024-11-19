import React from "react";

const MusicGallery = () => {
  const tracks = [
    { title: "Song 1", url: "https://drive.google.com/uc?id=1R3oEXRl-ZziaCu05mwcwqZd5kMB2FP_6" }
  ];

  return (
    <div className="music-gallery">
      <h2>My Music</h2>
      {tracks.map((track, index) => (
        <div key={index} className="music-item">
          <h3>{track.title}</h3>
          <audio controls>
            <source src={track.url} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}
    </div>
  );
};

export default MusicGallery;
