import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import '../styles/Gallery.css';

const Gallery = ({ fetchImages }) => {
  const [images, setImages] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const loaderRef = useRef(null);

  const loadMoreImages = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const { images: newImages, nextPageToken: token } = await fetchImages(nextPageToken);
      
      setImages((prev) => {
        const combined = [...prev, ...newImages];
        const unique = Array.from(new Map(combined.map(img => [img.id, img])).values());
        return unique;
      });

      setNextPageToken(token);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loading, nextPageToken, fetchImages]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextPageToken && !loading) {
          loadMoreImages();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [nextPageToken, loading, loadMoreImages]);

  useEffect(() => {
    if (images.length === 0) {
      loadMoreImages();
    }
  }, []);

  const handleNext = (e) => {
    e.stopPropagation();
    if (selectedImageIndex === images.length - 1 && nextPageToken) {
      loadMoreImages().then(() => {
        setSelectedImageIndex(prev => prev + 1);
      });
    } else {
      setSelectedImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (selectedImageIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedImageIndex(null);
      if (e.key === 'ArrowRight') handleNext(e);
      if (e.key === 'ArrowLeft') handlePrev(e);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, images.length, nextPageToken]);

  const Modal = () => {
    if (selectedImageIndex === null || !images[selectedImageIndex]) return null;

    return ReactDOM.createPortal(
      <div className="modal-backdrop" onClick={() => setSelectedImageIndex(null)}>
        <button className="modal-close" onClick={() => setSelectedImageIndex(null)}>
          ×
        </button>
        
        <button className="modal-nav prev" onClick={handlePrev}>
          ‹
        </button>

        <div className="modal-image-container" onClick={e => e.stopPropagation()}>
          <img 
            src={images[selectedImageIndex].urlFull} 
            alt="" 
          />
        </div>

        <button className="modal-nav next" onClick={handleNext}>
          ›
        </button>
      </div>,
      document.body
    );
  };

  return (
    <div className="gallery-container">
      <div className="gallery-grid">
        {images.map((image, index) => (
          <div 
            key={image.id} 
            className="gallery-item"
            onClick={() => setSelectedImageIndex(index)}
          >
            <img src={image.url} alt="" loading="lazy" />
          </div>
        ))}
      </div>
      
      <div ref={loaderRef} className="loader-area">
        {loading && <div className="spinner"></div>}
      </div>

      <Modal />
    </div>
  );
};

Gallery.propTypes = {
  fetchImages: PropTypes.func.isRequired,
};

export default Gallery;