import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/Gallery.css';

const Gallery = ({ images }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [imagesToShow, setImagesToShow] = useState(12); 

  const openModal = (index) => {
    setSelectedImageIndex(index);
  };


  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const goToPrevious = () => {
    setSelectedImageIndex(
      selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1
    );
  };

  const goToNext = () => {
    setSelectedImageIndex(
      selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1
    );
  };

  const loadMoreImages = () => {
    setImagesToShow(imagesToShow + 12); 
  };

  return (
    <div className="gallery-container">
      <h2>Gallery</h2>
      <div className="gallery">
        {images.slice(0, imagesToShow).map((image, index) => (
          <div key={index} className="image-item" onClick={() => openModal(index)}>
            <img src={image} alt={`Gallery ${index + 1}`} />
          </div>
        ))}
      </div>

      {imagesToShow < images.length && (
        <div className="show-more-container">
          <button className="show-more-btn" onClick={loadMoreImages}>
            Show More
          </button>
        </div>
      )}

      {selectedImageIndex !== null && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={images[selectedImageIndex]} alt="Selected" />
            <button className="close-btn" onClick={closeModal}>X</button>

            {/* Navigation Arrows */}
            <button className="prev-btn" onClick={goToPrevious}>&#8592;</button>
            <button className="next-btn" onClick={goToNext}>&#8594;</button>
          </div>
        </div>
      )}
    </div>
  );
};

Gallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired, // Array of image URLs
};

export default Gallery;
