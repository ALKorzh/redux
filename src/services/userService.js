// services/userService.js
// services/authService.js
import axios from 'axios';

export const checkUserCredentials = async (email, password) => {
  try {
    const response = await axios.post('/api/login', { email, password });
    if (response.data) {
      return response.data; // Возвращаем данные пользователя из ответа сервера
    }
    return null;
  } catch (error) {
    console.error('Login request failed:', error);
    throw error;
  }
};

export const getUserFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export const saveUserToLocalStorage = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};
