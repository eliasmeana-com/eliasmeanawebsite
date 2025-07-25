// pages/LatexTestPage.js
import React, { useEffect, useState } from 'react';
import LatexDocumentRenderer from '../utils/latexUtils/LatexDocumentRenderer';

function LatexTestPage() {
  const [latexScript, setLatexScript] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState(''); // for save feedback

  useEffect(() => {
    const fetchLatex = async () => {
      try {
        const response = await fetch('https://eliasmeanawebsite.onrender.com/api/latex/object/all');
        const data = await response.json();

        if (data.length > 0) {
          setLatexScript(data[0].latexCode);
          setInputValue(data[0].latexCode);
        } else {
          setLatexScript('No LaTeX documents found.');
          setInputValue('');
        }
      } catch (error) {
        console.error('Failed to fetch LaTeX:', error);
        setLatexScript('Error loading LaTeX document.');
        setInputValue('');
      }
    };

    fetchLatex();
  }, []);

  // Function to save the edited LaTeX back to your backend
  const saveLatex = async () => {
    setStatus('Saving...');
    try {
      const response = await fetch('https://eliasmeanawebsite.onrender.com/api/latex/object', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latexCode: inputValue }),
      });

      if (!response.ok) throw new Error('Failed to save LaTeX');

      const result = await response.json();
      setStatus('Saved successfully!');
      setLatexScript(inputValue); // update rendered latex to saved version
      console.log('Save result:', result);
    } catch (error) {
      setStatus('Error saving LaTeX');
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <h1>Latex Document Renderer Test</h1>

      <textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        rows={15}
        style={{ width: '100%', fontFamily: 'monospace', fontSize: '16px', marginBottom: '12px' }}
        placeholder="Type your LaTeX code here..."
      />

      <button onClick={saveLatex} style={{ padding: '8px 16px', fontSize: '16px' }}>
        Save LaTeX
      </button>

      <p style={{ marginTop: '8px', fontStyle: 'italic' }}>{status}</p>

      <hr style={{ margin: '24px 0' }} />

      <h2>Rendered LaTeX Output:</h2>
      <LatexDocumentRenderer latexScript={latexScript} />
    </div>
  );
}

export default LatexTestPage;
