import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateNote } from '../services/noteService'; // Импортируем функцию для обновления заметки
import { setNotes } from '../redux/actions/noteActions'; // Для обновления состояния заметок

function EditNote() {
  const { id } = useParams(); // Получаем id заметки из параметров URL
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { notes } = useSelector((state) => state.notes); // Получаем заметки из Redux
  const noteToEdit = notes.find((note) => note.id === parseInt(id)); // Ищем заметку по id

  const [note, setNote] = useState({ title: '', content: '' }); // Инициализация состояния заметки

  // Загружаем данные заметки, если она найдена
  useEffect(() => {
    if (noteToEdit) {
      if (noteToEdit.userId !== JSON.parse(localStorage.getItem('user')).id) {
        navigate('/'); // Если userId не совпадает, перенаправляем на главную страницу
      } else {
        setNote({ title: noteToEdit.title, content: noteToEdit.content });
      }
    } else {
      navigate('/'); // Если заметка не найдена, перенаправляем на главную страницу
    }
  }, [id, noteToEdit, navigate]);

  // Сохраняем обновленную заметку
  const handleSave = async () => {
    const updatedNote = {
      ...note,
      id: parseInt(id),
      userId: JSON.parse(localStorage.getItem('user')).id,
    };

    try {
      // Обновляем заметку на сервере
      await updateNote(updatedNote);

      // Обновляем заметку в Redux
      dispatch(setNotes(notes.map((n) => (n.id === updatedNote.id ? updatedNote : n))));

      // После сохранения возвращаемся на страницу со всеми заметками
      navigate('/notes');
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
