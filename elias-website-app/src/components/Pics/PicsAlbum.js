import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import Gallery from '../Gallery';
import {
  fetchPics,
  labelFromTag,
  getAlbumDescription,
  saveAlbumDescription,
} from '../../API/cloudinary';
import '../../styles/Pics.css';
import '../../styles/Gallery.css';

export default function PicsAlbum() {
  const { albumId } = useParams();
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [description, setDescription] = useState('');
  const [editValue, setEditValue] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('authToken');
  const isLoggedIn = !!token;
  const label = labelFromTag(albumId);

  useEffect(() => {
    setDescription(getAlbumDescription(albumId));
  }, [albumId]);

  useEffect(() => {
    fetchPics()
      .then(data => {
        const albumImages = data.filter(img =>
          (img.tags || []).includes(albumId)
        );
        setImages(albumImages);
        setLoading(false);
      })
      .catch(() => {
        setImages([]);
        setError('Failed to load images.');
        setLoading(false);
      });
  }, [albumId]);

  const fetchImages = async () => ({
    images,
    nextPageToken: null,
  });

  const startEditing = () => {
    setEditValue(description);
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setEditValue('');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      saveAlbumDescription(albumId, editValue);
      setDescription(editValue);
      setEditing(false);
    } catch {
      setError('Failed to save description.');
    } finally {
      setSaving(false);
    }
  };

  const sanitizedDescription = description
    ? DOMPurify.sanitize(description, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h2', 'h3', 'blockquote', 'code', 'pre'],
        ALLOWED_ATTR: ['href', 'target', 'rel'],
      })
    : '';

  if (loading) {
    return (
      <div className="pics-page">
        <div className="pics-loading">
          <div className="pics-spinner" />
          <p>Loading album...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pics-album">
      <div className="pics-album-topbar">
        <Link to="/pics" className="pics-album-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Pics
        </Link>
        <h1 className="pics-album-title">{label}</h1>
        <span className="pics-album-count">{images.length} photo{images.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="pics-album-content">
        {editing ? (
          <div className="pics-desc-editor">
            <textarea
              className="pics-desc-textarea"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder="Write a description for this album... (HTML supported)"
              rows={6}
            />
            <div className="pics-desc-editor-actions">
              <button className="pics-btn pics-btn-outline" onClick={cancelEditing}>Cancel</button>
              <button className="pics-btn" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : sanitizedDescription ? (
          <div className="pics-desc-display">
            <div
              className="pics-desc-body"
              dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
            />
            {isLoggedIn && (
              <button className="pics-desc-edit-btn" onClick={startEditing}>Edit</button>
            )}
          </div>
        ) : isLoggedIn ? (
          <div className="pics-desc-empty">
            <p>No description yet.</p>
            <button className="pics-btn" onClick={startEditing}>Add Description</button>
          </div>
        ) : null}

        {error && !images.length ? (
          <p className="pics-error">{error}</p>
        ) : images.length > 0 ? (
          <Gallery fetchImages={fetchImages} />
        ) : (
          <div className="pics-empty">
            <h3>No photos in this album</h3>
            <p>Tag images with <code>web_pics</code> and <code>{albumId}</code> in Cloudinary.</p>
          </div>
        )}
      </div>
    </div>
  );
}