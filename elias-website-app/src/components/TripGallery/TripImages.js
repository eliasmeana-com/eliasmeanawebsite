import React, { useEffect, useState } from 'react';
import Gallery from '../Gallery';
import '../../styles/Gallery.css';
import { initGoogleDriveClient, listImagesInFolderPaginated } from '../../API/googleDrive';

const TripImages = () => {
  const [error, setError] = useState(null);

  const folderId = '1T71KFg7tEDvpXyqBfUQsiK1jE0SA3pwP';

  const fetchImages = async (pageToken) => {
    try {
      await initGoogleDriveClient(); 
      return await listImagesInFolderPaginated(folderId, pageToken);
    } catch (err) {
      console.error('Error in fetchImages:', err);
      setError('Failed to load images from Google Drive.');
      throw err;
    }
  };

  return (
    <div className="gallery-images-text">
      <h2>Trip Out West</h2>
      {error ? <p>{error}</p> : <Gallery fetchImages={fetchImages} />}
    </div>
  );
};

export default TripImages;
