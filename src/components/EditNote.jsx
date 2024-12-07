import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateNote } from '../services/noteService';
import { setNotes } from '../redux/actions/noteActions';

function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { notes } = useSelector((state) => state.notes);
  const noteToEdit = notes.find((note) => note.id === id);

  const [note, setNote] = useState({ title: '', content: '' });

  // Загружаем данные заметки, если она найдена
  useEffect(() => {
    const userFromStorage = JSON.parse(localStorage.getItem('user'));
    if (!userFromStorage || !noteToEdit || noteToEdit.userId !== userFromStorage.id) {
      navigate('/'); // Если заметка не найдена или нет доступа, перенаправляем
    } else {
      setNote({ title: noteToEdit.title, content: noteToEdit.content });
    }
  }, [id, noteToEdit, navigate]);

  const handleSave = async () => {
    const updatedNote = {
      ...note,
      id: id,
      userId: JSON.parse(localStorage.getItem('user')).id,
    };

    try {
      await updateNote(updatedNote); // Обновляем заметку на сервере

      dispatch(setNotes(notes.map((n) => (n.id === updatedNote.id ? updatedNote : n)))); // Обновляем заметку в Redux

      navigate('/notes'); // Перенаправляем на страницу заметок
    } catch (error) {
      console.error('Error updating note:', error);
      alert('Error updating note!');
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Note</h1>
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
      <button onClick={handleSave} className="w-full bg-blue-500 text-white py-2 rounded">
        Save
      </button>
    </div>
  );
}

export default EditNote;
