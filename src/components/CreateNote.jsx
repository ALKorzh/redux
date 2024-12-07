import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveNote } from '../services/noteService';
import { useDispatch } from 'react-redux';
import { setNotes } from '../redux/actions/noteActions';

function CreateNote() {
  const [note, setNote] = useState({ title: '', content: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCreate = async () => {
    const newNote = {
      ...note,
      id: Date.now(),
      userId: JSON.parse(localStorage.getItem('user')).id, // Получаем userId из localStorage
    };

    // Сохраняем заметку через API
    await saveNote(newNote);

    // Обновляем состояние в Redux
    dispatch(setNotes((prevNotes) => [...prevNotes, newNote]));

    navigate('/notes');
  };

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Note</h1>
      <input
        type="text"
        placeholder="Title"
        value={note.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
        className="w-full p-2 mb-4 border rounded"
      />
      <textarea
        placeholder="Content"
        value={note.content}
        onChange={(e) => setNote({ ...note, content: e.target.value })}
        className="w-full p-2 mb-4 border rounded"
      />
      <button onClick={handleCreate} className="w-full bg-blue-500 text-white py-2 rounded">
        Create Note
      </button>
    </div>
  );
}

export default CreateNote;
