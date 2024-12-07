import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage'; // Главная страница
import Login from './components/Login'; // Страница входа
import Register from './components/Register'; // Страница регистрации
import EditNote from './components/EditNote'; // Страница редактирования заметки
import ViewNote from './components/ViewNote'; // Страница просмотра заметки
import NotFoundPage from './components/NotFound'; // Страница для 404 ошибки
import CreateNote from './components/CreateNote'; // Страница создания новой заметки
import Notes from './components/Notes'; // Страница для отображения всех заметок

function App() {
  return (
    <Router>
      <Routes>
        {/* Главная страница */}
        <Route path="/" element={<HomePage />} />

        {/* Страница входа */}
        <Route path="/login" element={<Login />} />

        {/* Страница регистрации */}
        <Route path="/register" element={<Register />} />

        {/* Страница создания новой заметки */}
        <Route path="/notes/new" element={<CreateNote />} />

        {/* Страница редактирования заметки */}
        <Route path="/notes/edit/:id" element={<EditNote />} />

        {/* Страница просмотра заметки */}
        <Route path="/notes/:id" element={<ViewNote />} />

        {/* Страница отображения всех заметок */}
        <Route path="/notes" element={<Notes />} />

        {/* Страница для 404 ошибки */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
