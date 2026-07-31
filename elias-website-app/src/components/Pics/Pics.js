import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchPics, extractAlbums, getAlbumDescription } from '../../API/cloudinary';
import '../../styles/Pics.css';

export default function Pics() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPics()
      .then(setImages)
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  const albums = useMemo(() => extractAlbums(images), [images]);

  if (loading) {
    return (
      <div className="pics-page">
        <div className="pics-loading">
          <div className="pics-spinner" />
          <p>Loading albums...</p>
        </div>
      </div>
    );
  }

  if (albums.length === 0) {
    return (
      <div className="pics-page">
        <div className="pics-hero">
          <h1>Pics</h1>
          <p className="hero-subtitle">Photo albums</p>
        </div>
        <div className="pics-content">
          <div className="pics-empty">
            <h3>No albums yet</h3>
            <p>Tag your images with <code>web_pics</code> plus a folder tag (e.g. <code>trip-west</code>) in Cloudinary.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pics-page">
      <div className="pics-hero">
        <h1>Pics</h1>
        <p className="hero-subtitle">Photo albums</p>
      </div>

      <div className="pics-content">
        <div className="pics-grid">
          {albums.map(album => {
            const cover = album.images[0];
            const desc = getAlbumDescription(album.key);
            return (
              <Link to={`/pics/${album.key}`} key={album.key} className="pics-card">
                <div className="pics-card-cover">
                  {cover ? (
                    <img src={`${cover.url}?w=600&h=450&c=fill`} alt={album.label} />
                  ) : (
                    <div className="pics-card-placeholder">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                  )}
                  <div className="pics-card-overlay">
                    <span>View Album</span>
                  </div>
                </div>
                <div className="pics-card-body">
                  <h3 className="pics-card-title">{album.label}</h3>
                  <p className="pics-card-count">{album.images.length} photo{album.images.length !== 1 ? 's' : ''}</p>
                  {desc && <p className="pics-card-desc">{truncateText(desc)}</p>}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function truncateText(text) {
  const stripped = text.replace(/<[^>]*>/g, '');
  if (stripped.length <= 100) return stripped;
  return stripped.substring(0, 97) + '...';
}