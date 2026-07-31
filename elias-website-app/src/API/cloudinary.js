const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

const BACKEND_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:8080'
    : 'https://eliasmeanawebsite.onrender.com';

const CATEGORIES = {
  preprint: 'Preprints',
  published: 'Published',
  'school-project': 'School Projects',
  thesis: 'Theses',
};

export function getCategories() {
  return CATEGORIES;
}

export function getAlbumDescription(albumId) {
  try {
    const raw = localStorage.getItem('album_descriptions');
    if (!raw) return '';
    const descriptions = JSON.parse(raw);
    return descriptions[albumId] || '';
  } catch {
    return '';
  }
}

export function saveAlbumDescription(albumId, description) {
  const raw = localStorage.getItem('album_descriptions');
  const descriptions = raw ? JSON.parse(raw) : {};
  descriptions[albumId] = description;
  localStorage.setItem('album_descriptions', JSON.stringify(descriptions));
}

export function labelFromTag(tag) {
  return tag
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/* ---- Papers ---- */

let papersCache = null;
let papersPromise = null;

export async function fetchPapers(tag) {
  const cacheKey = tag || '_all';
  if (papersCache && papersCache[cacheKey]) return papersCache[cacheKey];
  if (papersPromise && papersPromise[cacheKey]) return papersPromise[cacheKey];

  if (!papersPromise) papersPromise = {};
  if (!papersCache) papersCache = {};

  const url = tag
    ? `${BACKEND_URL}/api/papers?tag=${encodeURIComponent(tag)}`
    : `${BACKEND_URL}/api/papers`;

  papersPromise[cacheKey] = fetch(url).then(async (res) => {
    if (!res.ok) throw new Error('Failed to fetch papers');
    const data = await res.json();
    papersCache[cacheKey] = data;
    papersPromise[cacheKey] = null;
    return data;
  }).catch((err) => {
    papersPromise[cacheKey] = null;
    throw err;
  });

  return papersPromise[cacheKey];
}

/* ---- Pics ---- */

const PICS_BASE_TAG = 'web_pics';

let picsCache = null;
let picsPromise = null;

export async function fetchPics() {
  if (picsCache) return picsCache;
  if (picsPromise) return picsPromise;

  picsPromise = fetch(`${BACKEND_URL}/api/pics`).then(async (res) => {
    if (!res.ok) throw new Error('Failed to fetch pics');
    const data = await res.json();
    picsCache = data;
    picsPromise = null;
    return data;
  }).catch((err) => {
    picsPromise = null;
    throw err;
  });

  return picsPromise;
}

export function extractAlbums(images) {
  const tagsByKey = {};
  for (const img of images) {
    const folderTags = (img.tags || []).filter(t => t !== PICS_BASE_TAG);
    for (const tag of folderTags) {
      if (!tagsByKey[tag]) tagsByKey[tag] = { key: tag, label: labelFromTag(tag), images: [] };
      tagsByKey[tag].images.push(img);
    }
  }
  return Object.values(tagsByKey).sort((a, b) => a.label.localeCompare(b.label));
}

/* ---- Legacy / direct Cloudinary ---- */

export const listImagesInTag = async (tagName) => {
  try {
    const response = await fetch(
      `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${tagName}.json`
    );

    if (!response.ok) {
      throw new Error('Could not fetch images.');
    }

    const data = await response.json();

    const allImages = data.resources.map(file => ({
      url: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_1000/${file.public_id}.${file.format}`,
      urlFull: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_2000/${file.public_id}.${file.format}`,
      id: file.public_id,
    }));

    const uniqueImages = Array.from(new Map(allImages.map(img => [img.id, img])).values());

    return {
      images: uniqueImages,
      nextPageToken: null
    };
  } catch (error) {
    console.error('Cloudinary Fetch Error:', error);
    throw error;
  }
};

export const uploadToCloudinary = async (file) => {
  const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "blog images";

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Upload failed');

    const data = await res.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
};