import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NoteEditorWrapper from '../../utils/latexUtils/NoteEditorWrapper'; // new component you created
import useClassName from '../../utils/hooks/useClassName';
import '../../styles/latexPage.css';
import { BASE_URL } from '../../API/baseUrl';

function LatexTestPage() {
  const location = useLocation().pathname.split('/');
  const classCode = location[2];
  const assignmentCode = location[3];

  const { className, status: classNameStatus } = useClassName(classCode);

  const [assignmentName, setAssignmentName] = useState('');
  const [assignmentStatus, setAssignmentStatus] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

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

  // Fetch all notes for this assignment
  useEffect(() => {
    if (!assignmentCode) return;

    const fetchNotes = async () => {
      setLoading(true);
      try {
        // Adjust this endpoint if needed to fetch multiple notes for the assignment
        const response = await fetch(`${BASE_URL}/api/assignments/notes/all/${encodeURIComponent(assignmentCode)}`);
        if (!response.ok) {
          setStatus('Failed to load notes');
          setNotes([]);
          setLoading(false);
          return;
        }
        const data = await response.json();

        // Sort by createdDate descending (newest first)
        data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

        setNotes(data);
        setStatus('');
      } catch (error) {
        console.error('Error fetching notes:', error);
        setStatus('Error loading notes');
        setNotes([]);
      }
      setLoading(false);
    };

    fetchNotes();
  }, [assignmentCode]);

  // Save or update a note
  const handleSaveNote = async (note) => {
    setStatus('Saving...');
    try {
      let response;
      if (note._id) {
        // Update existing note
        response = await fetch(`${BASE_URL}/api/assignments/object/update/${note._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ latexCode: note.latexCode, name: note.name }),
        });
      } else {
        // Create new note
        response = await fetch(`${BASE_URL}/api/assignments/object/create/${encodeURIComponent(classCode)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ latexCode: note.latexCode, name: note.name }),
        });
      }

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to save note');
      }

      const savedNote = await response.json();

      // Update note list with saved note (handle new id for new notes)
      setNotes((prevNotes) => {
        const existingIndex = prevNotes.findIndex((n) => n._id === savedNote.document?._id || note._id);
        if (existingIndex !== -1) {
          // Replace updated note
          const newNotes = [...prevNotes];
          newNotes[existingIndex] = savedNote.document || note;
          return newNotes;
        } else {
          // Add new note
          return [savedNote.document || note, ...prevNotes];
        }
      });

      setStatus('Saved successfully!');
    } catch (error) {
      console.error(error);
      setStatus('Error saving note');
    }
  };

  // Delete a note
  const handleDeleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    setStatus('Deleting note...');
    try {
      const response = await fetch(`${BASE_URL}/api/assignments/object/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete note');
      }
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
      setStatus('Note deleted');
    } catch (error) {
      console.error(error);
      setStatus('Error deleting note');
    }
  };

  // Add new blank note
  const handleAddNote = () => {
    const newNote = {
      _id: null, // no ID until saved
      latexCode: '',
      name: '',
      createdDate: new Date().toISOString(),
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
  };

  return (
    <div className="notes-page-wrapper" style={{ maxWidth: 900, margin: '30px auto', padding: '0 20px 40px' }}>
      <h2>Assignment for {className || 'Loading...'}</h2>
      <h3>{assignmentName || 'Loading...'}</h3>

      <button
        onClick={handleAddNote}
        className="latex-create-button"
        style={{
          marginBottom: 30,
          padding: '10px 24px',
          fontSize: '1rem',
          fontWeight: 600,
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          transition: 'background-color 0.25s ease',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#145ea8')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#1976d2')}
      >
        + Add Note
      </button>

      {status && <p style={{ color: status.toLowerCase().includes('error') ? 'crimson' : 'green' }}>{status}</p>}

      {loading ? (
        <p>Loading notes...</p>
      ) : notes.length === 0 ? (
        <p>No notes found. Click “Add Note” to create one.</p>
      ) : (
        notes.map((note) => (
          <NoteEditorWrapper key={note._id || Math.random()} note={note} onSave={handleSaveNote} onDelete={handleDeleteNote} />
        ))
      )}
    </div>
  );
}

export default LatexTestPage;
