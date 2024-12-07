import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ViewNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notes } = useSelector((state) => state.notes); // Получаем все заметки из Redux

  const note = notes.find((n) => n.id === id);

  useEffect(() => {
    if (!note) {
      navigate('/'); // Если заметка не найдена, перенаправляем на главную страницу
    }
  }, [note, navigate]);

  if (!note) return <div className="text-center py-10 text-xl text-gray-600">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
      <button
        onClick={() => navigate(-1)} // Используем navigate(-1) для возврата на предыдущую страницу
        className="mb-4 text-blue-500 hover:underline"
      >
        Back
      </button>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{note.title}</h1>
      <p className="text-lg text-gray-700 leading-relaxed">{note.content}</p>
    </div>
  );
}

export default ViewNote;
