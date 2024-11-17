import React from 'react';

function PDFViewer() {

  return (
    <div className="pdf-viewer">
      <h1>PDF Viewer</h1>
      <iframe
        src={`https://docs.google.com/gview?url=https://drive.google.com/uc?id=1vj9vYSrcaZ7p1OLMdLYno9c1G8GVUtRN&embedded=true`}
        width="100%"
        height="600px"
        frameBorder="0"
        title="PDF Document"
      />
    </div>
  );
}

export default PDFViewer;