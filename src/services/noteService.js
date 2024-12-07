import axios from 'axios';

// URL json-server
const API_URL = 'http://localhost:5000'; // адрес json-server

// Универсальная функция для отправки запросов
const apiRequest = async (method, url, data = null) => {
  try {
    const response = await axios({
      method,
      url,
      data,
    });
    return response.data; // Возвращаем данные с сервера
  } catch (error) {
    console.error(`Error in ${method.toUpperCase()} request to ${url}:`, error);
    if (error.response) {
      // Сервер вернул ответ с ошибкой
      const errorMessage = `Server responded with status ${error.response.status}`;
      alert(errorMessage); // Можем уведомить пользователя
    } else if (error.request) {
      // Нет ответа от сервера
      alert('No response from server. Please try again later.');
    } else {
      // Проблемы с настройкой запроса
      alert('An error occurred while setting up the request.');
    }
    throw error;
  }
};

// Функция для получения заметок пользователя
export const fetchNotes = async (userId) => {
  const url = `${API_URL}/notes?userId=${userId}`; // Фильтруем заметки по userId
  const data = await apiRequest('get', url);
  if (Array.isArray(data)) {
    return data; // Возвращаем данные с сервера
  } else {
    console.warn('Data is not an array:', data);
    return []; // Возвращаем пустой массив, если данные не в формате массива
  }
};

// Функция для удаления заметки
export const deleteNote = async (id) => {
  const url = `${API_URL}/notes/${id}`;
  try {
    await apiRequest('delete', url); // Отправка DELETE запроса на сервер
  } catch (error) {
    console.error('Failed to delete note:', error);
    throw error; // Пробрасываем ошибку для дальнейшей обработки
  }
};

// Функция для сохранения новой заметки
export const saveNote = async (note) => {
  const url = `${API_URL}/notes`;
  return await apiRequest('post', url, note); // Возвращаем созданную заметку с сервера
};

// Функция для обновления заметки

export const updateNote = async (note) => {
  const url = `${API_URL}/notes/${note.id}`;
  return await apiRequest('put', url, note); // Отправляем PUT запрос на обновление заметки
};
