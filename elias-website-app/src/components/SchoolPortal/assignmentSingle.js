import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import LatexDocumentRenderer from '../../utils/latexUtils/LatexDocumentRenderer';
import useLatexDocument from '../../utils/latexUtils/LatexPageFunctions';
import '../../styles/latexPage.css';

function LatexTestPage() {
    const location = useLocation().pathname.split('/');
    const classCode = location[2];
    const assignmentCode = location[3];

    const {
        latexScript,
        inputValue,
        setInputValue,
        status,
        editMode,
        setEditMode,
        saveLatex,
    } = useLatexDocument({ type: 'assignment', classCode, assignmentCode });

    const [className, setClassName] = useState('');
    const [assignmentName, setAssignmentName] = useState('');
    const [classNameStatus, setClassNameStatus] = useState('');
    const [assignmentStatus, setAssignmentStatus] = useState('');

    // Fetch class name
    useEffect(() => {
        if (!classCode) return;

        const fetchClassName = async () => {
            try {
                setClassNameStatus('Loading class name...');
                const response = await fetch(
                    `https://eliasmeanawebsite.onrender.com/api/schedule/object/classcode/${encodeURIComponent(classCode)}`
                );
                if (!response.ok) {
                    setClassNameStatus('Failed to load class name');
                    setClassName('');
                    return;
                }
                const data = await response.json();
                setClassName(data.name || 'Unnamed Class');
                setClassNameStatus('');
            } catch (error) {
                console.error('Error fetching class name:', error);
                setClassNameStatus('Error loading class name');
                setClassName('');
            }
        };

        fetchClassName();
    }, [classCode]);

    // Fetch assignment name
    useEffect(() => {
        if (!assignmentCode) return;

        const fetchAssignmentName = async () => {
            try {
                setAssignmentStatus('Loading assignment name...');
                const response = await fetch(
                    `https://eliasmeanawebsite.onrender.com/api/assignments/object/id/${encodeURIComponent(assignmentCode)}`
                );
                if (!response.ok) {
                    setAssignmentStatus('Failed to load assignment name');
                    setAssignmentName('');
                    return;
                }
                const data = await response.json();
                setAssignmentName(data.assignmentName || 'Untitled Assignment');
                setAssignmentStatus('');
            } catch (error) {
                console.error('Error fetching assignment name:', error);
                setAssignmentStatus('Error loading assignment name');
                setAssignmentName('');
            }
        };

        fetchAssignmentName();
    }, [assignmentCode]);

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

            <p
                className="assignment-name-status"
                style={{ color: assignmentStatus.startsWith('Error') ? 'crimson' : 'green' }}
            >
                {assignmentStatus}
            </p>

            <hr className="latex-divider" />

            <h2 className="latex-output-heading">
                Assignment For {className || 'Loading...'}
            </h2>
            <h3 className="latex-output-heading">
                {assignmentName || 'Loading assignment name...'}
            </h3>

            <LatexDocumentRenderer latexScript={latexScript} />
        </div>
    );
}

export default LatexTestPage;
