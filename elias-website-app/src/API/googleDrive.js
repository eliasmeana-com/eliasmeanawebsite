import { gapi } from 'gapi-script';


// Replace 'YOUR_API_KEY' with the valid API key
const API_KEY = "AIzaSyCV_acvNBBsqTAmoHguFz_s3SB-QSPx4Rg"; // Make sure this is your valid API Key

export const loadGapi = async () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google API script'));
    document.body.appendChild(script);
  });
};

export const initGoogleDriveClient = async () => {
  return new Promise((resolve, reject) => {
    gapi.load('client:auth2', async () => {
      try {
        await gapi.client.init({
          apiKey: API_KEY, // Use the valid API key here
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
};

// List images in a folder
export const listImagesInFolder = async (folderId) => {
  try {
    const response = await gapi.client.drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/'`,
      fields: 'files(id, name)',
      key: API_KEY, // Use the valid API key here
    });

    const files = response.result.files;
    // Map over the files and create a proper URL for each image
    return files.map(file => {
      // Generate the proper image URL for embedding
      return `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`;
    });
  } catch (error) {
    console.error('Error fetching images from Google Drive:', error);
    throw error;
  }
};
