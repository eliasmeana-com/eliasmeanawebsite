import { pdfjs } from 'react-pdf';
import React from 'react';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function Birla() {
  const pdfUrl = 'pdfs/BirlaPoster'; 
  return (
    <div className="birla-page">
      <h1>Birla PDF Viewer</h1>
      <div className="pdf-viewer-container">
        <Viewer fileUrl={pdfUrl} />
      </div>
    </div>
  );
}

export default Birla;

