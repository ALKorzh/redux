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
    const user = JSON.parse(localStorage.getItem('user')); // Get user data from localStorage

    if (!user) {
      // If no user data found, prompt user to log in
      alert('You must be logged in to create a note');
      navigate('/login'); // Redirect to login page
      return;
    }

    const newNote = {
      ...note,
      id: `${Date.now()}`,
      userId: user.id, // Use userId from localStorage
    };

    // Save the new note via API
    await saveNote(newNote);

    // Update Redux state with new note
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
