import React from 'react';
import '../../styles/PDFPage.css';

function PDFViewer() {

  const pdfid='1mbQlYNcR740wijmbLK77iOBTw521K2rG'
  return (
    <div className="pdf-viewer">
      <h1>PEL Method</h1>
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