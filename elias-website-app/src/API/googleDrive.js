import { gapi } from 'gapi-script';


const API_KEY = process.env.REACT_APP_API_KEY; 

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
    console.log('Loading gapi client...');
    gapi.load('client', async () => {
      try {
        console.log('Initializing gapi client...');
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        });
        console.log('gapi client initialized successfully.');
        resolve();
      } catch (error) {
        console.error('Error initializing gapi client:', error);
        reject(error);
      }
    });
  });
};


export const listImagesInFolderPaginated = async (folderId, pageToken = null, pageSize = 12) => {
  try {
    const response = await gapi.client.drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/'`,
      fields: 'nextPageToken, files(id, name)',
      pageSize,
      pageToken,
    });

    const images = response.result.files.map(file => ({
      url: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`,
      urlFull : `https://drive.google.com/thumbnail?id=${file.id}&sz=w5000`,
      id: file.id,
    }));
    console.log(images.length);
    return {
      images,
      nextPageToken: response.result.nextPageToken,
    };
  } catch (error) {
    throw new Error('Error fetching images: ' + error.message);
  }
};

