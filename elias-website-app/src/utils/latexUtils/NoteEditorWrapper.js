import React, { useState, useEffect } from 'react';
import LatexEditor from './LatexEditor';

export default function NoteEditorWrapper({ note, onSave, onDelete }) {
  const [inputValue, setInputValue] = useState(note.latexCode);
  const [name, setName] = useState(note.name || '');
  const [editMode, setEditMode] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setInputValue(note.latexCode);
    setName(note.name || '');
  }, [note.latexCode, note.name]);

  const handleSave = async () => {
    setStatus('Saving...');
    await onSave({ latexCode: inputValue, name });
    setStatus('Saved!');
    setEditMode(false);
    setTimeout(() => setStatus(''), 2000);
  };

  return (
    <LatexEditor
      inputValue={inputValue}
      setInputValue={setInputValue}
      name={name}
      setName={setName}
      editMode={editMode}
      setEditMode={setEditMode}
      onSave={handleSave}
      onDelete={onDelete}
      heading={name || 'Untitled Note'}
      status={status}
    />
  );
}
