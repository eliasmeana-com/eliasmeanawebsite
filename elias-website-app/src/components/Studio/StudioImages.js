import '../../styles/Studio.css'
import React, { useState } from "react";

const StudioImages = () => {
  const images = [
    "/Images/Rack.jpg",
    "/Images/me.jpg",
    "/Images/HSS.jpg", // Add more images as needed
  ];

  // State to track the index of the selected image
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Function to open the modal with the clicked image
  const openModal = (index) => {
    setSelectedImageIndex(index);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  // Function to go to the previous image
  const goToPrevious = () => {
    setSelectedImageIndex(
      selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1
    );
  };

  // Function to go to the next image
  const goToNext = () => {
    setSelectedImageIndex(
      selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1
    );
  };

  return (
    <div className="studio-images">
      <h2>My Studio & Equipment</h2>
      <div className="gallery">
        {images.map((image, index) => (
          <div key={index} className="image-item" onClick={() => openModal(index)}>
            <img src={image} alt={`Studio ${index + 1}`} />
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedImageIndex !== null && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={images[selectedImageIndex]} alt="Selected" />
            <button className="close-btn" onClick={closeModal}>Close</button>

            {/* Navigation Arrows */}
            <button className="prev-btn" onClick={goToPrevious}>&#8592;</button>
            <button className="next-btn" onClick={goToNext}>&#8594;</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudioImages;

