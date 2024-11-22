import { gapi } from 'gapi-script';


// Replace 'YOUR_API_KEY' with the valid API key
const API_KEY = process.env.REACT_APP_API_KEY; // Make sure this is your valid API Key

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
  const images = [];
  let nextPageToken = null;

  do {
    const response = await gapi.client.drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/'`,
      fields: 'nextPageToken, files(id, name)',
      pageSize: 100, // Fetch up to 100 files per request
      pageToken: nextPageToken, // For pagination
    });

    if (response.result.files) {
      images.push(...response.result.files);
    }

    nextPageToken = response.result.nextPageToken; // Update the page token for the next iteration
  } while (nextPageToken); // Continue fetching until there is no nextPageToken

  // Generate proper URLs for the images
  return images.map(file => `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`);
};

