import React from 'react';
import '../styles/PDFPage.css';

function PDFViewer() {

  const pdfid='1SHqMXz4oj9Oc89eHzcooO-KIaRF4f3Mt'
  return (
    <div className="pdf-viewer">
      <h1>Proposal D-Wave Device
      </h1>
      <iframe
        src={`https://docs.google.com/gview?url=https://drive.google.com/uc?id=${pdfid}&embedded=true`}
        width="100%"
        height="600px"
        frameBorder="0"
        title="PDF Document"
      />
    </div>
  );
}

export default PDFViewer;