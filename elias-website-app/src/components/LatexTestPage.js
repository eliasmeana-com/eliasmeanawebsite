import React, { useEffect, useState } from 'react';
import LatexDocumentRenderer from '../utils/latexUtils/LatexDocumentRenderer';
import '../styles/classNotes.css';

function LatexTestPage() {
    const [latexScript, setLatexScript] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [status, setStatus] = useState('');
    const [documentId, setDocumentId] = useState(null);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const fetchLatex = async () => {
            try {
                const response = await fetch('https://eliasmeanawebsite.onrender.com/api/latex/object/all');
                const data = await response.json();

                if (data.length > 0) {
                    setLatexScript(data[0].latexCode);
                    setInputValue(data[0].latexCode);
                    setDocumentId(data[0]._id);
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

    const saveLatex = async () => {
        if (!documentId) {
            setStatus('No document ID found. Cannot update.');
            return;
        }

        setStatus('Saving...');
        try {
            const response = await fetch(`https://eliasmeanawebsite.onrender.com/api/latex/object/update/${documentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ latexCode: inputValue }),
            });

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
