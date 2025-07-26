import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LatexDocumentRenderer from '../utils/latexUtils/LatexDocumentRenderer';
import '../styles/classNotes.css';
import {BASE_URL} from '../API/baseUrl'

function LatexTestPage() {
  const { pageCode } = useParams();

  const [latexScript, setLatexScript] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('');
  const [documentId, setDocumentId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [docExists, setDocExists] = useState(true); // track if document exists

  useEffect(() => {
    if (!pageCode) {
      setStatus('No page code provided in URL.');
      return;
    }

    const fetchLatex = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/latex/object/pageCode/${encodeURIComponent(pageCode)}`
        );

        if (response.status === 404) {
          setStatus('Document does not exist yet.');
          setDocExists(false);
          setLatexScript('');
          setInputValue('');
          return;
        }

        if (!response.ok) throw new Error('Failed to fetch LaTeX document');

        const data = await response.json();
        setLatexScript(data.latexCode);
        setInputValue(data.latexCode);
        setDocumentId(data._id);
        setDocExists(true);
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
    setStatus('Saving...');

    try {
      let response;

      if (docExists && documentId) {
        // PUT (update existing)
        response = await fetch(
          `${BASE_URL}/api/latex/object/update/${documentId}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latexCode: inputValue }),
          }
        );
      } else {
        // POST (create new)
        response = await fetch(
          `${BASE_URL}/api/latex/object/create/${encodeURIComponent(pageCode)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latexCode: inputValue }),
          }
        );
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save LaTeX');
      }

      const result = await response.json();

      setStatus('Saved successfully!');
      setLatexScript(result.latexCode || inputValue);
      setEditMode(false);

      // If new doc, update internal state
      if (!docExists) {
        setDocExists(true);
        setDocumentId(result.document?._id ?? null);
      }
    } catch (error) {
      console.error(error);
      setStatus('Error saving LaTeX');
    }
  };

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
