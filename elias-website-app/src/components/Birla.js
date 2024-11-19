import React from 'react';
import '../styles/PDFPage.css';

function PDFViewer() {

  const pdfid='1vj9vYSrcaZ7p1OLMdLYno9c1G8GVUtRN'
  return (
    <div className="pdf-viewer">
      <h1>Birla Poster</h1>
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