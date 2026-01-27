const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

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