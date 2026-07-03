import React, { useState, useEffect } from 'react';
import '../styles/Sportsite.css';

const DEFAULT_IFRAME_CODE = `<iframe id="player" marginheight="0" marginwidth="0" src="https://embedindia.st/embed/wc/2026-07-03/aus-egy/telemundo" scrolling="no" allowfullscreen="yes" allow="encrypted-media; picture-in-picture;" width="100%" height="100%" frameborder="0" style="position:absolute;"></iframe>`;

function Sportsite() {
  const [iframeCode, setIframeCode] = useState(DEFAULT_IFRAME_CODE);
  const [embedSrc, setEmbedSrc] = useState(null);

  const extractSrc = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const iframe = doc.querySelector('iframe');
    return iframe ? iframe.getAttribute('src') : null;
  };

  const loadEmbed = (code) => {
    const src = extractSrc(code);
    if (src) setEmbedSrc(src);
  };

  const handleEmbed = () => {
    loadEmbed(iframeCode.trim());
  };

  const handleClear = () => {
    setIframeCode('');
    setEmbedSrc(null);
  };

  // Auto-load the default embed on first render
  useEffect(() => {
    loadEmbed(DEFAULT_IFRAME_CODE);
  }, []);

  return (
    <div className="embed-app">
      <header className="embed-header">
        <h1>📺 Embed Viewer</h1>
        <p>Paste any iframe embed code and watch it load.</p>
      </header>

      <div className="embed-input-area">
        <textarea
          className="embed-textarea"
          value={iframeCode}
          onChange={(e) => setIframeCode(e.target.value)}
          placeholder='<iframe src="https://example.com/embed/..." width="100%" height="100%"></iframe>'
        />
        <div className="embed-buttons">
          <button className="btn btn-primary" onClick={handleEmbed}>Load Embed</button>
          <button className="btn btn-secondary" onClick={handleClear}>Clear</button>
        </div>
      </div>

      <div className="embed-preview">
        {embedSrc ? (
          <iframe
            src={embedSrc}
            title="Embedded content"
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            allow="encrypted-media; picture-in-picture; fullscreen; autoplay"
          />
        ) : (
          <div className="placeholder">
            <span>⬆ Paste an embed code above and click <strong>Load Embed</strong></span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sportsite;