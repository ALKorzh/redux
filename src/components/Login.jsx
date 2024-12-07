import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/actions/authActions';
import { getUserFromLocalStorage } from '../services/userService'; // Импортируем функцию из services
import { checkUserCredentials } from '../services/userService'; // Импортируем функцию для запроса на сервер

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // Используем правильное состояние

  useEffect(() => {
    // Если пользователь уже авторизован, перенаправляем на страницу home
    if (user) {
      navigate('/');
    }
  }, [user, navigate]); // Зависимость только от user

  useEffect(() => {
    // Сбрасываем форму после выхода пользователя из системы
    if (!user) {
      setEmail('');
      setPassword('');
    }
  }, [user]); // Зависимость от user

  const handleLogin = async () => {
    const storedUser = getUserFromLocalStorage(); // Check localStorage first

    if (
      storedUser &&
      storedUser.email.trim() === email.trim() &&
      storedUser.password === password
    ) {
      // If user found in localStorage, store in Redux and navigate
      dispatch(setUser(storedUser));
      navigate('/home');
    } else {
      try {
        // If user not found in localStorage, check the server
        const userFromServer = await checkUserCredentials(email, password);

        if (userFromServer) {
          // Save user data to localStorage
          localStorage.setItem('user', JSON.stringify(userFromServer));

          // Save user to Redux
          dispatch(setUser(userFromServer));

          navigate('/home');
        } else {
          setError('Invalid email or password');
        }
      } catch (error) {
        console.error('Error during login:', error);
        setError('Failed to authenticate. Please try again later.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>} {/* Ошибка */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Login
        </button>
      </form>

      <div className="mt-4 text-center">
        <p>
          Don't have an account?{' '}
          <a href="/register" className="text-blue-500 hover:text-blue-600">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
