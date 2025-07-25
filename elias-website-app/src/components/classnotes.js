import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LatexDocumentRenderer from '../utils/latexUtils/LatexDocumentRenderer';
import useLatexDocument from '../utils/latexUtils/LatexPageFunctions'; // your existing hook
import '../styles/classNotes.css';

function LatexTestPage() {
    const { pageCode } = useParams();

    // Your existing hook for LaTeX document
    const {
        latexScript,
        inputValue,
        setInputValue,
        status,
        editMode,
        setEditMode,
        saveLatex,
    } = useLatexDocument(pageCode);
    const [className, setClassName] = useState('');
    const [classNameStatus, setClassNameStatus] = useState('');

    useEffect(() => {
        if (!pageCode) return;
        const fetchClassName = async () => {
            try {
                setClassNameStatus('Loading class name...');
                const response = await fetch(
                    `https://eliasmeanawebsite.onrender.com/api/schedule/object/classcode/${encodeURIComponent(pageCode)}`
                );
                if (!response.ok) {
                    setClassNameStatus('Failed to load class name');
                    setClassName('');
                    return;
                }
                const data = await response.json();

                // data should be the object containing the class info, including 'name'
                setClassName(data.name || 'Unnamed Class');
                setClassNameStatus('');
            } catch (error) {
                console.error('Error fetching class name:', error);
                setClassNameStatus('Error loading class name');
                setClassName('');
            }
        };

        fetchClassName();
    }, [pageCode]);

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

            <p
                className="class-name-status"
                style={{ color: classNameStatus.startsWith('Error') ? 'crimson' : 'green' }}
            >
                {classNameStatus}
            </p>

            <hr className="latex-divider" />

            <h2 className="latex-output-heading">
                Notes For {className || 'Loading...'}
            </h2>

            <LatexDocumentRenderer latexScript={latexScript} />
        </div>
    );
}

export default LatexTestPage;
