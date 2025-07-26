// components/LatexEditor.js
import React from 'react';
import LatexDocumentRenderer from './LatexDocumentRenderer';

export default function LatexEditor({
  inputValue,
  setInputValue,
  editMode,
  setEditMode,
  saveLatex,
  latexScript,
  status,
  heading1,
  heading2,
  extraStatus = [],
}) {
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
            <button onClick={saveLatex} className="latex-save-button">Save Document</button>
            <button onClick={() => setEditMode(false)} className="latex-cancel-button">Cancel</button>
          </div>
        </>
      )}

      <p className="latex-status" style={{ color: status.startsWith('Error') ? 'crimson' : 'green' }}>
        {status}
      </p>

      {extraStatus.map((s, i) => (
        <p
          key={i}
          className="latex-status"
          style={{ color: s?.startsWith('Error') ? 'crimson' : 'green' }}
        >
          {s}
        </p>
      ))}

      <hr className="latex-divider" />

      {heading1 && <h2 className="latex-output-heading">{heading1}</h2>}
      {heading2 && <h3 className="latex-output-heading">{heading2}</h3>}

      <LatexDocumentRenderer latexScript={latexScript} />
    </div>
  );
}
