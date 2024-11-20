import React from "react";
import Gallery from '../Gallery';
import '../../styles/Studio.css';

const StudioImages = () => {
  const images = require.context('../../Images/TripImages', false, /\.(jpg|jpeg|png|svg)$/);
  const imagePaths = images.keys().map(image => images(image));
  return (
    <div className="studio-images">
      <h2>Trip Out West</h2>
      <Gallery images={imagePaths} />
    </div>
  );
};

export default StudioImages;
