import React, { useEffect, useState } from 'react';
import {  useLocation } from 'react-router-dom';
// import LatexDocumentRenderer from '../../utils/latexUtils/LatexDocumentRenderer';
import LatexEditor from '../../utils/latexUtils/LatexEditor';
import useClassName from '../../utils/hooks/useClassName';
import useLatexDocument from '../../utils/latexUtils/LatexPageFunctions';
import '../../styles/latexPage.css';
import { BASE_URL } from '../../API/baseUrl'

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

    // const [className, setClassName] = useState('');
    const [assignmentName, setAssignmentName] = useState('');
    // const [classNameStatus, setClassNameStatus] = useState('');
    const [assignmentStatus, setAssignmentStatus] = useState('');
    const { className, status: classNameStatus } = useClassName(classCode);

    // Fetch assignment name
    useEffect(() => {
        if (!assignmentCode) return;

        const fetchAssignmentName = async () => {
            try {
                setAssignmentStatus('Loading assignment name...');
                const response = await fetch(
                    `${BASE_URL}/api/assignments/object/id/${encodeURIComponent(assignmentCode)}`
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
        <LatexEditor
            inputValue={inputValue}
            setInputValue={setInputValue}
            editMode={editMode}
            setEditMode={setEditMode}
            saveLatex={saveLatex}
            latexScript={latexScript}
            status={status}
            heading1={`Assignment for ${className || 'Loading...'}`}
            heading2={assignmentName || 'Loading...'}
            extraStatus={[classNameStatus, assignmentStatus]} />
    );
}

export default LatexTestPage;
