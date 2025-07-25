import React from 'react';
import { useParams } from 'react-router-dom';
import LatexDocumentRenderer from '../utils/latexUtils/LatexDocumentRenderer';
import useLatexDocument from '../utils/latexUtils/LatexPageFunctions';
import '../styles/classNotes.css';

function LatexTestPage() {
  const { pageCode } = useParams();
  const {
    latexScript,
    inputValue,
    setInputValue,
    status,
    editMode,
    setEditMode,
    saveLatex,
  } = useLatexDocument(pageCode);
  console.log(useLatexDocument(pageCode));

  return (
    <div className="latex-container">
      <div className="latex-header-bar">
        {!editMode && (
          <button onClick={() => setEditMode(true)} className="latex-edit-button">
            Edit Document
          </button>
        )}
      </div>

      {editMode && (
        <>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            rows={15}
            className="latex-textarea"
            placeholder="Edit your LaTeX code here..."
          />

          <div className="button-container">
            <button onClick={saveLatex} className="latex-save-button">
              Save Document
            </button>
            <button onClick={() => setEditMode(false)} className="latex-cancel-button">
              Cancel
            </button>
          </div>
        </>
      )}

      <p
        className="latex-status"
        style={{ color: status.startsWith('Error') ? 'crimson' : 'green' }}
      >
        {status}
      </p>

      <hr className="latex-divider" />

      <h2 className="latex-output-heading">Notes For </h2>
      <LatexDocumentRenderer latexScript={latexScript} />
    </div>
  );
}

export default LatexTestPage;
