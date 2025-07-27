// utils/latexUtils/useLatexNotes.js
import { useState, useEffect } from 'react';
import { BASE_URL } from '../../API/baseUrl';

export default function useLatexNotes(classCode) {
  const [notes, setNotes] = useState([]);
  const [status, setStatus] = useState('');

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/classnotes/object/classCode/${classCode}`);
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      setNotes(data);
      setStatus('');
    } catch (err) {
      console.error(err);
      setNotes([]);
      setStatus('Failed to load notes');
    }
  };

  const addNote = async () => {
    const response = await fetch(`${BASE_URL}/api/classnotes/object/create/${classCode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latexCode: 'Enter Note Here' }),
    });

    const result = await response.json();
    if (response.ok) {
      setNotes((prev) => [...prev, result.document]);
    } else {
      console.error(result);
      setStatus('Error creating note');
    }
  };

  const updateNote = async (id, latexCode) => {
    const response = await fetch(`${BASE_URL}/api/classnotes/object/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latexCode }),
    });

    if (response.ok) {
      const updated = await response.json();
      setNotes((prev) => prev.map((n) => (n._id === id ? updated : n)));
    } else {
      console.error('Failed to update note');
    }
  };

  const deleteNote = async (id) => {
    const response = await fetch(`${BASE_URL}/api/classnotes/object/delete/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } else {
      console.error('Failed to delete note');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [classCode]);

  return {
    notes,
    status,
    addNote,
    updateNote,
    deleteNote,
  };
}
