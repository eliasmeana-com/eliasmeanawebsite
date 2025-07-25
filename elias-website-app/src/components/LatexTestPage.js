import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';  // import useParams
import LatexDocumentRenderer from '../utils/latexUtils/LatexDocumentRenderer';
import '../styles/classNotes.css';

function LatexTestPage() {
  const { pageCode } = useParams();  // get pageCode from URL params

  const [latexScript, setLatexScript] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('');
  const [documentId, setDocumentId] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!pageCode) {
      setStatus('No page code provided in URL.');
      return;
    }

    const fetchLatex = async () => {
      try {
        const response = await fetch(
          `https://eliasmeanawebsite.onrender.com/api/latex/object/pageCode/${encodeURIComponent(pageCode)}`
        );

        if (response.status === 404) {
          setLatexScript('LaTeX document not found.');
          setInputValue('');
          setStatus('');
          return;
        }

        if (!response.ok) throw new Error('Failed to fetch LaTeX document');

        const data = await response.json();

        setLatexScript(data.latexCode);
        setInputValue(data.latexCode);
        setDocumentId(data._id);
        setStatus('');
      } catch (error) {
        console.error('Failed to fetch LaTeX:', error);
        setLatexScript('Error loading LaTeX document.');
        setInputValue('');
        setStatus('Error loading document.');
      }
    };

    fetchLatex();
  }, [pageCode]);

  const saveLatex = async () => {
    if (!documentId) {
      setStatus('No document ID found. Cannot update.');
      return;
    }

    setStatus('Saving...');
    try {
      const response = await fetch(
        `https://eliasmeanawebsite.onrender.com/api/latex/object/update/${documentId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ latexCode: inputValue }),
        }
      );

      if (!response.ok) throw new Error('Failed to save LaTeX');

      const result = await response.json();
      setStatus('Saved successfully!');
      setLatexScript(result.latexCode);
      setEditMode(false);
    } catch (error) {
      setStatus('Error saving LaTeX');
      console.error(error);
    }
  };

  return (
    <div className="latex-container">
      <div className="latex-header-bar">
        {!editMode ? (
          <button onClick={() => setEditMode(true)} className="latex-edit-button">
            Edit Document
          </button>
        ) : null}
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

      <h2 className="latex-output-heading">Rendered Output:</h2>
      <LatexDocumentRenderer latexScript={latexScript} />
    </div>
  );
}

export default LatexTestPage;
