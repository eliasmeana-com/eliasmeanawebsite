import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../styles/Sportsite.css';

const DEFAULT_IFRAME_CODE = '<iframe id="player" marginheight="0" marginwidth="0" src="https://embedindia.st/embed/wc/2026-07-03/aus-egy" scrolling="no" allowfullscreen="yes" allow="encrypted-media; picture-in-picture;" width="100%" height="100%" frameborder="0" style="position:absolute;"></iframe>';

function Sportsite() {
  const [iframeCode, setIframeCode] = useState(DEFAULT_IFRAME_CODE);
  const [currentIframeParsed, setCurrentIframeParsed] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [proxyKey, setProxyKey] = useState(0);
  const previewContainerRef = useRef(null);
  const textareaRef = useRef(null);

  const parseIframeString = (str) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');
    const iframeEl = doc.querySelector('iframe');
    if (!iframeEl) return null;
    const src = iframeEl.getAttribute('src');
    if (!src || src.trim() === '') return null;
    return { src: src.trim() };
  };

  const handleEmbed = () => {
    const raw = iframeCode.trim();
    if (!raw) {
      alert('Please paste an iframe code first.');
      return;
    }
    const parsed = parseIframeString(raw);
    if (!parsed) {
      alert('Could not find a valid iframe with a src attribute. Check your code.');
      return;
    }
    setCurrentIframeParsed(parsed);
    setProxyKey((prev) => prev + 1);
  };

  const handleClear = () => {
    setIframeCode('');
    setCurrentIframeParsed(null);
    setProxyKey((prev) => prev + 1);
    if (textareaRef.current) textareaRef.current.focus();
  };

  const handleFullscreen = useCallback(() => {
    const container = previewContainerRef.current;
    if (!container) return;
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {});
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
  }, []);

  useEffect(() => {
    const updateFS = () => {
      setIsFullscreen(!!(document.fullscreenElement || document.webkitFullscreenElement));
    };
    document.addEventListener('fullscreenchange', updateFS);
    document.addEventListener('webkitfullscreenchange', updateFS);
    return () => {
      document.removeEventListener('fullscreenchange', updateFS);
      document.removeEventListener('webkitfullscreenchange', updateFS);
    };
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'f' || e.key === 'F') {
        const tag = document.activeElement?.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;
        handleFullscreen();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleFullscreen]);

  useEffect(() => {
    const parsed = parseIframeString(DEFAULT_IFRAME_CODE);
    if (parsed) {
      setCurrentIframeParsed(parsed);
      setProxyKey(1);
    }
  }, []);

  return (
    <div className="sportsite">
      <header className="sportsite-header">
        <div className="sportsite-logo">
          <span className="sportsite-logo-dot"></span>
          Secure Embed
        </div>
        <span className="sportsite-subtitle">Blocks pop‑ups &amp; new tabs</span>
      </header>

      <div className="sportsite-container">
        <div className="sportsite-input-area">
          <label htmlFor="sportsite-iframeInput">Paste iframe code</label>
          <textarea
            id="sportsite-iframeInput"
            ref={textareaRef}
            value={iframeCode}
            onChange={(e) => setIframeCode(e.target.value)}
            placeholder='<iframe src="https://..." ...></iframe>'
          />
          <div className="sportsite-button-row">
            <button className="sportsite-btn sportsite-btn-primary" onClick={handleEmbed}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="5 12 12 5 19 12"></polyline>
                <polyline points="5 12 12 19 19 12"></polyline>
              </svg>
              Embed Securely
            </button>
            <button className="sportsite-btn sportsite-btn-secondary" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        <div
          className="sportsite-preview-wrapper"
          ref={previewContainerRef}
          onDoubleClick={(e) => {
            if (e.target.closest('button') || e.target.closest('textarea')) return;
            handleFullscreen();
          }}
        >
          {!currentIframeParsed && (
            <div className="sportsite-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
              <span>Your embed will appear here</span>
              <span className="sportsite-placeholder-sub">Pop‑ups are blocked automatically</span>
            </div>
          )}

          {currentIframeParsed && (
            <span className="sportsite-sandbox-badge">🔒 Pop‑up Shield Active</span>
          )}

          {currentIframeParsed && (
            <iframe
              key={proxyKey}
              src={`/proxy.html?url=${encodeURIComponent(currentIframeParsed.src)}`}
              sandbox="allow-scripts allow-same-origin allow-popups"
              allow="encrypted-media; picture-in-picture; fullscreen; autoplay"
              allowFullScreen={true}
              title="Secure embed"
            />
          )}

          {currentIframeParsed && (
            <button className="sportsite-fullscreen-btn" onClick={handleFullscreen} title="Fullscreen">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
              <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
            </button>
          )}
        </div>
      </div>

      <footer className="sportsite-footer">
        Pop‑ups, new tabs, and top‑navigation redirects are intercepted and blocked.
        <div className="sportsite-console-note">
          ⚠️ Console errors about blocked pop‑ups are normal — they mean blocking is working.
        </div>
      </footer>
    </div>
  );
}

export default Sportsite;