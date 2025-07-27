import React from 'react';
import LatexDocumentRenderer from './LatexDocumentRenderer';

export default function LatexEditor({
  inputValue,
  setInputValue,
  name,
  setName,
  editMode,
  setEditMode,
  onSave,
  onDelete,
  heading,
  status,
}) {
  return (
    <div className="latex-container">
      {status && (
        <p className="latex-status" style={{ color: status.startsWith('Error') ? 'crimson' : 'green' }}>
          {status}
        </p>
      )}

      {editMode && (
        <>
          <input
            type="text"
            className="note-name-input"
            placeholder="Note title..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            rows={12}
            className="latex-textarea"
            placeholder="Edit your LaTeX code here..."
          />
        </>
      )}

      {!editMode && (
        <>
          {heading && <h3 className="latex-output-heading">{heading}</h3>}
          <LatexDocumentRenderer latexScript={inputValue} />
        </>
      )}

      <div className="button-container">
        {!editMode ? (
          <button onClick={() => setEditMode(true)} className="latex-edit-button">Edit</button>
        ) : (
          <>
            <button onClick={onSave} className="latex-save-button">Save</button>
            <button onClick={() => setEditMode(false)} className="latex-cancel-button">Cancel</button>
          </>
        )}
        <button onClick={onDelete} className="latex-delete-button">Delete</button>
      </div>
    </div>
  );
}
