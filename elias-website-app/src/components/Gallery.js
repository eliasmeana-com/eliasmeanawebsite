import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import '../styles/Gallery.css';

const Gallery = ({ fetchImages }) => {
  const [images, setImages] = useState([]); // Stores the list of images
  const [nextPageToken, setNextPageToken] = useState(null); // Pagination token
  const [loading, setLoading] = useState(false); // Loading state
  const [selectedImageIndex, setSelectedImageIndex] = useState(null); // Modal state
  const loaderRef = useRef(null); // Ref for lazy loading

  // Function to load more images
  const loadMoreImages = async () => {
    if (loading) return; // Prevent duplicate fetches
    setLoading(true);

    try {
      const { images: newImages, nextPageToken: token } = await fetchImages(nextPageToken);
      setImages((prev) => [...prev, ...newImages]);
      setNextPageToken(token);
    } catch (err) {
      console.error('Error loading images:', err);
    } finally {
      setLoading(false);
    }
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextPageToken) {
          loadMoreImages();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [nextPageToken]);


  // Initial load of images
  useEffect(() => {
    loadMoreImages();
  }, []);

  // Modal navigation functions
  const openModal = (index) => {
    setSelectedImageIndex(index);
    console.log(images[selectedImageIndex]);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
    console.log(selectedImageIndex)
  };

  const goToPrevious = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = async () => {
    if (selectedImageIndex === images.length - 1 && nextPageToken) {
      // Try to load more images when we reach the last image and there's a next page token
      await loadMoreImages();
    } else {
      // Otherwise, navigate to the next image
      setSelectedImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };
  
  // Inside the component, update modal logic to handle keyboard navigation
  useEffect(() => {
    if (selectedImageIndex !== null) {
      const handleKeyDown = (event) => {
        if (event.key === "ArrowRight") {
          goToNext();
        } else if (event.key === "ArrowLeft") {
          goToPrevious();
        } else if (event.key === "Escape") {
          closeModal();
        }
      };

      // Add keydown event listener
      window.addEventListener("keydown", handleKeyDown);

      // Cleanup event listener when modal closes
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [selectedImageIndex, goToNext, goToPrevious, closeModal]);

  return (
    <div className="gallery-container">
      <h2>Gallery</h2>
      <div className="gallery">
        {images.map((image, index) => (
          <div
            key={index}
            className="image-item"
            onClick={() => openModal(index)}
          >
            <img src={image.url} alt={`Gallery ${index + 1}`} />
          </div>
        ))}
      </div>

      {/* Loader */}
      {nextPageToken && (
        <div className="show-more-container" ref={loaderRef}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <button onClick={loadMoreImages} className="show-more-btn">
              Show More
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {selectedImageIndex !== null && (
        <div className="modal" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[selectedImageIndex].urlFull}
              alt={`Selected ${selectedImageIndex}`}
            />
            <button className="close-btn" onClick={closeModal}>
              X
            </button>

            {/* Navigation Arrows */}
            <button className="prev-btn" onClick={goToPrevious}>
              &#8592;
            </button>
            <button className="next-btn" onClick={goToNext}>
              &#8594;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

Gallery.propTypes = {
  fetchImages: PropTypes.func.isRequired, // Function to fetch images
};

export default Gallery;
