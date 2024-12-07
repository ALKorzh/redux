// services/userService.js
// services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000'; // адрес json-server

export const checkUserCredentials = async (email, password) => {
  try {
    // Отправляем запрос на поиск пользователя по email
    const response = await axios.get(`${API_URL}/users`, {
      params: { email, password }, // параметры запроса
    });

    if (response.data.length > 0) {
      // Если находим пользователя, возвращаем данные
      return response.data[0]; // Возвращаем первого найденного пользователя
    }

    return null; // Если не нашли, возвращаем null
  } catch (error) {
    console.error('Login request failed:', error);
    throw error; // Выкидываем ошибку
  }
};

export const getUserFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export const saveUserToLocalStorage = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};
