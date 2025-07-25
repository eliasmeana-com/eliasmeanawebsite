import { useState, useEffect } from 'react';

export default function useLatexDocument(pageCode) {
  const [latexScript, setLatexScript] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('');
  const [documentId, setDocumentId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [docExists, setDocExists] = useState(true);

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
        response = await fetch(
          `https://eliasmeanawebsite.onrender.com/api/latex/object/update/${documentId}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latexCode: inputValue }),
          }
        );
      } else {
        response = await fetch(
          `https://eliasmeanawebsite.onrender.com/api/latex/object/create/${encodeURIComponent(pageCode)}`,
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

      if (!docExists) {
        setDocExists(true);
        setDocumentId(result.document?._id ?? null);
      }
    } catch (error) {
      console.error(error);
      setStatus('Error saving LaTeX');
    }
  };

  return {
    latexScript,
    inputValue,
    setInputValue,
    status,
    editMode,
    setEditMode,
    saveLatex,
  };
}
