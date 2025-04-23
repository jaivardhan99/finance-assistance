import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../store/auth';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/user/login', formData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        const user = response.data.user;
        dispatch(login({ username: user.username, email: user.email }));
        alert('Login successful!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Error during login:', error);
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Welcome Back 👋</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-gray-600">Don't have an account?</span>
          <button
            onClick={handleRegister}
            className="ml-2 text-blue-600 hover:underline font-medium"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
