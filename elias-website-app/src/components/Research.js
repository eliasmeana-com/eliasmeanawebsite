import React from 'react';
import '../styles/PDFPage.css';

function PDFGridPage() {
  const pdfs = [
    {
      id: '1vj9vYSrcaZ7p1OLMdLYno9c1G8GVUtRN',
      title: 'PDF Viewer',
    },
    {
      id: '1SHqMXz4oj9Oc89eHzcooO-KIaRF4f3Mt',
      title: 'Proposal D-Wave Device',
    },
  ];

  return (
    <div className="pdf-grid">
      {pdfs.map((pdf) => (
        <div key={pdf.id} className="pdf-item">
          <h1>{pdf.title}</h1>
          <iframe
            src={`https://docs.google.com/gview?url=https://drive.google.com/uc?id=${pdf.id}&embedded=true`}
            width="100%"
            height="500px"
            frameBorder="0"
            title={pdf.title}
          />
        </div>
      ))}
    </div>
  );
}

export default PDFGridPage;
