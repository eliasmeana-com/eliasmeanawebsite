import React, { useEffect, useState } from 'react';
import Gallery from '../Gallery';
import '../../styles/Gallery.css';
import { initGoogleDriveClient, listImagesInFolder } from '../../API/googleDrive';

const StudioImages = () => {
  const [imagePaths, setImagePaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Google Drive folder ID (replace with your actual folder ID)
  const folderId = '1LsanyvMoY7ohh6c727CsOw1sBbcKaqW1'; // Replace with your Google Drive folder ID

  useEffect(() => {
    const fetchImages = async () => {
      try {
        await initGoogleDriveClient(); // Initialize Google Drive API client
        const images = await listImagesInFolder(folderId); // Fetch image URLs
        setImagePaths(images);
      } catch (err) {
        setError('Failed to load images from Google Drive.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [folderId]);

  return (
    <div className="gallery-images-text">
      <h2>My Studio Pics</h2>
      {loading ? (
        <p>Loading images...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <Gallery images={imagePaths} />
      )}
    </div>
  );
};

export default StudioImages;
