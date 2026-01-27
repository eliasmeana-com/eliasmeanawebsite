import React, { useState } from 'react';
import Gallery from '../Gallery';
import '../../styles/Gallery.css';
import { listImagesInTag } from '../../API/cloudinary'; 

const TripImages = () => {
  const [error, setError] = useState(null);

  const tagIdentifier = 'studio_pics';

  const fetchImages = async (pageToken) => {
    try {
      return await listImagesInTag(tagIdentifier);
    } catch (err) {
      console.error('Error in fetchImages:', err);
      setError('Failed to load images from the cloud gallery.');
      throw err;
    }
  };

  return (
    <div className="gallery-images-text">
      <h2>Trip Out West</h2>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <Gallery fetchImages={fetchImages} />
      )}
    </div>
  );
};

export default TripImages;