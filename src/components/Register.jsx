import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/actions/authActions'; // Импортируем setUser для Redux
import axios from 'axios';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  const handleRegister = async () => {
    setError(null); // Сбросим глобальные ошибки перед каждой новой проверкой
    setEmailError(null);
    setPasswordError(null);

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError(
        'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number.'
      );
      return;
    }

    try {
      const existingUser = await axios.get(`http://localhost:5000/users?email=${email}`);
      if (existingUser.data.length > 0) {
        setError('Email is already registered.');
        return;
      }

      const user = { email, password };

      // Отправляем запрос на сервер для регистрации пользователя
      const response = await axios.post('http://localhost:5000/users', user);

      // Сохраняем пользователя в localStorage
      localStorage.setItem('user', JSON.stringify(response.data));

      // Обновляем состояние Redux
      dispatch(setUser(response.data));

      // Перенаправляем на главную страницу после успешной регистрации
      navigate('/');
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Register</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {emailError && <p className="text-red-500 mb-4">{emailError}</p>}
      {passwordError && <p className="text-red-500 mb-4">{passwordError}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setEmailError(null); // Сбрасываем ошибку при изменении email
        }}
        className="w-full p-2 mb-4 border rounded"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      <button onClick={handleRegister} className="w-full bg-blue-500 text-white py-2 rounded">
        Register
      </button>

      <div className="mt-4 text-center">
        <p>
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:text-blue-600">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
