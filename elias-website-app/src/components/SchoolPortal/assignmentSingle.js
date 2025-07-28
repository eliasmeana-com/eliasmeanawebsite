import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NoteEditorWrapper from '../../utils/latexUtils/NoteEditorWrapper';
import { BASE_URL } from '../../API/baseUrl';
import useClassName from '../../utils/hooks/useClassName';
import '../../styles/latexPage.css';
import useAssignmentName from '../../utils/hooks/useAssignmentName';


export default function LatexNotesPage() {
    const token = localStorage.getItem('authToken');
    console.log(token)

    const location = useLocation().pathname.split('/');
    const classCode = location[2];
    const assignmentCode = location[3];
    const [notes, setNotes] = useState([]);
    const [status, setStatus] = useState('');
    const { className } = useClassName(classCode);
    const { assignmentName } = useAssignmentName(assignmentCode)

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/assignmentNote/all/assignmentCode/${assignmentCode}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                setNotes(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Failed to fetch notes', err);
            }
        };
        fetchNotes();
    }, [classCode]);

    const createNote = async () => {
        const newNote = {
            latexCode: 'Enter Code Here',
            classCode: classCode,
            name: 'Untitled Note',
        };

        try {
            const res = await fetch(`${BASE_URL}/api/assignmentNote/create/${encodeURIComponent(assignmentCode)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(newNote),
            });

            const result = await res.json();
            if (result.document) {
                setNotes((prev) => [...prev, result.document]);
            }
        } catch (err) {
            console.error('Failed to create note', err);
        }
    };

    const updateNote = async (id, { latexCode, name }) => {
        try {
            const res = await fetch(`${BASE_URL}/api/assignmentNote/update/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ latexCode, name }),
            });

            if (res.ok) {
                const updated = await res.json();
                setNotes((prev) => prev.map((n) => (n._id === id ? updated : n)));
            }
        } catch (err) {
            console.error('Failed to update note', err);
        }
    };

    const deleteNote = async (id) => {
        try {
            const res = await fetch(`${BASE_URL}/api/assignmentNote/delete/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` },
                method: 'DELETE',
            });

            if (res.ok) {
                setNotes((prev) => prev.filter((n) => n._id !== id));
            }
        } catch (err) {
            console.error('Failed to delete note', err);
        }
    };

    return (
        <div className="notes-page-wrapper">
            <h2>Class Notes for {className || classCode}</h2>
            <h2>Assignment :  {assignmentName || assignmentCode}</h2>
            {token && (
                <button
                    onClick={createNote}
                    className="latex-create-button"
                    id="create_assignment_note"
                >
                    Add New Note
                </button>
            )}
            {notes.map((note) => (
                <NoteEditorWrapper
                    key={note._id}
                    note={note}
                    onSave={(data) => updateNote(note._id, data)}
                    onDelete={() => deleteNote(note._id)}
                />
            ))}
        </div>
    );
}
