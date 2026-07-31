import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchPapers, getCategories } from '../API/cloudinary';
import '../styles/PDFPage.css';

const ALL_CATEGORIES = { all: 'All Papers', ...getCategories(), general: 'Other' };

const SECTION_ICONS = {
  preprint: '📄',
  published: '📰',
  'school-project': '📚',
  thesis: '🎓',
  general: '📎',
};

function tagClass(tag) {
  if (ALL_CATEGORIES[tag]) return tag;
  return '';
}

export default function Research() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchPapers()
      .then(setPapers)
      .catch(() => setPapers([]))
      .finally(() => setLoading(false));
  }, []);

  const groupedAll = useMemo(() => {
    const acc = {};
    for (const p of papers) {
      const cat = p.tags?.find(t => ALL_CATEGORIES[t]) || 'general';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(p);
    }
    return acc;
  }, [papers]);

  const tabCounts = useMemo(() => {
    const counts = { all: papers.length };
    for (const [cat, items] of Object.entries(groupedAll)) {
      counts[cat] = items.length;
    }
    return counts;
  }, [papers, groupedAll]);

  const filteredGrouped = useMemo(() => {
    if (activeTab === 'all') return groupedAll;
    const items = groupedAll[activeTab];
    return items ? { [activeTab]: items } : {};
  }, [groupedAll, activeTab]);

  if (loading) {
    return (
      <div className="research-page">
        <div className="research-loading">
          <div className="research-spinner" />
          <p style={{ color: 'var(--research-text-muted)' }}>Loading papers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="research-page">
      <div className="research-hero">
        <h1>Research</h1>
        <p className="hero-subtitle">Papers, preprints, and projects</p>
      </div>

      <div className="research-tabs">
        {Object.entries(ALL_CATEGORIES).map(([key, label]) => {
          const count = tabCounts[key];
          if (!count) return null;
          return (
            <button
              key={key}
              className={`research-tab${activeTab === key ? ' active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              {label}
              <span className="research-tab-count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="research-content">
        {Object.keys(filteredGrouped).length === 0 && (
          <div className="research-empty">
            <h3>No papers in this category</h3>
            <p>Check back later for new additions.</p>
          </div>
        )}

        {Object.entries(filteredGrouped).map(([cat, items]) => (
          <section key={cat} className="research-section">
            {activeTab === 'all' && (
              <div className="research-section-header">
                <div className={`research-section-icon ${cat}`}>
                  {SECTION_ICONS[cat] || '📎'}
                </div>
                <h2 className="research-section-title">{ALL_CATEGORIES[cat]}</h2>
                <span className="research-section-count">{items.length} paper{items.length !== 1 ? 's' : ''}</span>
              </div>
            )}

            <div className="research-grid">
              {items.map(paper => (
                <article key={paper.slug} className="research-card">
                  <div className="research-card-preview">
                    <iframe
                      src={`${paper.url}#toolbar=0&navpanes=0&scrollbar=0`}
                      width="100%"
                      height="100%"
                      title={paper.title}
                      className="research-card-iframe"
                    />
                    <Link to={`/paper/${paper.slug}`} className="research-card-overlay">
                      <span>Read Paper</span>
                    </Link>
                  </div>
                  <div className="research-card-body">
                    <h3 className="research-card-title">{paper.title}</h3>
                    <div className="research-card-tags">
                      {paper.tags?.filter(t => t !== 'paper').map(t => (
                        <span key={t} className={`research-tag ${tagClass(t)}`}>
                          {t.replace(/-/g, ' ')}
                        </span>
                      ))}
                    </div>
                    <div className="research-card-actions">
                      <Link to={`/paper/${paper.slug}`} className="research-btn research-btn-primary">
                        Read
                      </Link>
                      <a
                        href={paper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="research-btn research-btn-outline"
                        download
                      >
                        Download
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}