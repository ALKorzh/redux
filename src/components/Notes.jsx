import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotes } from '../services/noteService';
import { setNotes } from '../redux/actions/noteActions';
import { setUser } from '../redux/actions/authActions';
import { Link, useNavigate } from 'react-router-dom';
import { deleteNote } from '../services/noteService';

function Notes() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { notes } = useSelector((state) => state.notes);
  const [loading, setLoading] = useState(true); // Флаг загрузки заметок
  const [deleting, setDeleting] = useState(false); // Флаг удаления заметки

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      dispatch(setUser(savedUser));
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    // Загружаем заметки только если их еще нет
    const loadNotes = async () => {
      try {
        setLoading(true); // Включаем флаг загрузки
        const fetchedNotes = await fetchNotes(user.id);
        dispatch(setNotes(fetchedNotes)); // Загружаем заметки
      } catch (error) {
        console.error('Error loading notes:', error);
      } finally {
        setLoading(false); // Выключаем флаг загрузки
      }
    };
    loadNotes();
  }, [dispatch, user, notes.length]); // Зависимость от notes.length

  const handleDelete = async (id) => {
    try {
      setDeleting(true); // Включаем флаг удаления
      await deleteNote(id);
      // Обновляем локальное состояние без удаленной заметки
      dispatch(setNotes(notes.filter((note) => note.id !== id)));
    } catch (error) {
      console.error('Failed to delete note:', error);
      alert('Error deleting note!');
    } finally {
      setDeleting(false); // Выключаем флаг удаления
    }
  };

  const handleLogout = () => {
    // Удаляем пользователя из localStorage
    localStorage.removeItem('user');

    // Сбрасываем пользователя в Redux
    dispatch(setUser(null));

    // Перенаправляем на страницу логина
    navigate('/login');
  };

  if (loading) {
    return <p>Loading notes...</p>; // Пока идет загрузка
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Notes</h1>
        <nav className="flex space-x-4 ml-auto">
          <Link to="/" className="text-gray-700 hover:underline">
            Home
          </Link>
          <Link to="/notes" className="text-gray-700 hover:underline">
            Notes
          </Link>
          <button onClick={handleLogout} className="text-gray-700 hover:underline">
            Logout
          </button>
        </nav>
      </header>

      <Link to="/notes/new" className="bg-blue-500 text-white py-2 px-4 rounded mb-4 inline-block">
        Create New Note
      </Link>

      {Array.isArray(notes) && notes.length > 0 ? (
        <ul className="space-y-4">
          {notes.map((note) => (
            <li key={note.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{note.title}</h2>
              <p className="text-gray-600">
                {note.content ? note.content.substring(0, 100) : 'No content available...'}
              </p>
              <div className="mt-4 flex space-x-2">
                <Link to={`/notes/${note.id}`} className="text-blue-500">
                  View
                </Link>
                <Link to={`/notes/edit/${note.id}`} className="text-green-500">
                  Edit
                </Link>
                <button
                  className="text-red-500"
                  onClick={() => handleDelete(note.id)}
                  disabled={deleting} // Отключаем кнопку, если идет процесс удаления
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No notes found. Create a new one!</p>
      )}
    </div>
  );
}

export default Notes;
