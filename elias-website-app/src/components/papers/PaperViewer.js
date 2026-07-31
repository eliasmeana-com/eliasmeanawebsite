import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPapers, getCategories } from '../../API/cloudinary';
import '../../styles/PDFPage.css';

const ALL_CATEGORIES = { ...getCategories(), general: 'Other' };

function tagClass(tag) {
  if (ALL_CATEGORIES[tag]) return tag;
  return '';
}

export default function PaperViewer() {
  const { slug } = useParams();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPapers()
      .then(setPapers)
      .catch(() => setPapers([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="research-page">
        <div className="research-loading">
          <div className="research-spinner" />
          <p style={{ color: 'var(--research-text-muted)' }}>Loading paper...</p>
        </div>
      </div>
    );
  }

  const paper = papers.find(p => p.slug === slug);

  if (!paper) {
    return (
      <div className="paper-detail">
        <div className="paper-detail-notfound">
          <h1>Paper not found</h1>
          <p>No paper matching "{slug}" was found.</p>
          <Link to="/research" className="research-btn research-btn-primary">Back to Research</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="paper-detail">
      <div className="paper-detail-topbar">
        <Link to="/research" className="paper-detail-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Research
        </Link>

        <h1 className="paper-detail-title">{paper.title}</h1>

        <div className="paper-detail-meta">
          {paper.tags?.filter(t => t !== 'paper').map(t => (
            <span key={t} className={`paper-detail-tag ${tagClass(t)}`}>
              {t.replace(/-/g, ' ')}
            </span>
          ))}
        </div>

        <a
          href={paper.url}
          target="_blank"
          rel="noopener noreferrer"
          className="paper-detail-download"
          download
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          Download
        </a>
      </div>

      <div className="paper-detail-viewer">
        <iframe src={paper.url} title={paper.title} />
      </div>
    </div>
  );
}