import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NoteEditorWrapper from '../../utils/latexUtils/NoteEditorWrapper';
import { BASE_URL } from '../../API/baseUrl';
import useClassName from '../../utils/hooks/useClassName';
import '../../styles/ClassNotes.css';

export default function LatexNotesPage() {
  const { classCode } = useParams();
  const [notes, setNotes] = useState([]);
  const [status, setStatus] = useState('');
  const { className } = useClassName(classCode);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/classnotes/object/classCode/${classCode}`);
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
      const res = await fetch(`${BASE_URL}/api/classnotes/object/create/${classCode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch(`${BASE_URL}/api/classnotes/object/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch(`${BASE_URL}/api/classnotes/object/delete/${id}`, {
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
      <button onClick={createNote} className="latex-create-button">Add New Note</button>
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
