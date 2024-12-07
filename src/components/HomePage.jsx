import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotes, deleteNote } from '../services/noteService';
import { setNotes } from '../redux/actions/noteActions';
import { setUser } from '../redux/actions/authActions';

function HomePage() {
  const { user } = useSelector((state) => state.auth || {}); // Добавляем дефолтное значение для user
  const { notes } = useSelector((state) => state.notes); // Получаем заметки из Redux
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Хук для навигации

  useEffect(() => {
    if (!user) {
      // Если пользователь не авторизован, перенаправляем на страницу логина
      navigate('/login');
    } else {
      const loadNotes = async () => {
        const fetchedNotes = await fetchNotes(user.id);
        dispatch(setNotes(fetchedNotes));
      };
      loadNotes();
    }
  }, [user, dispatch, navigate]);

  const handleDelete = async (id) => {
    try {
      await deleteNote(id); // Удаляем заметку
      dispatch(setNotes(notes.filter((note) => note.id !== id))); // Обновляем список заметок
    } catch (error) {
      console.error('Failed to delete note:', error);
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user ? user.email : 'Guest'}</h1>
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

      <div className="mb-4">
        <Link to="/notes/new" className="bg-blue-500 text-white py-2 px-4 rounded">
          Create New Note
        </Link>
      </div>

      {Array.isArray(notes) && notes.length > 0 ? (
        <ul>
          {notes.map((note) => (
            <li key={note.id} className="bg-white p-4 rounded shadow mb-4">
              <h2 className="text-xl">{note.title}</h2>
              <p>{note.content.substring(0, 100)}</p>
              <div>
                <Link to={`/notes/${note.id}`} className="text-blue-500">
                  View
                </Link>
                <button onClick={() => handleDelete(note.id)} className="text-red-500 ml-4">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No notes available. Create a new one!</p>
      )}
    </div>
  );
}

export default HomePage;
