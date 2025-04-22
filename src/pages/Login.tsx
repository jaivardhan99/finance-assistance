import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../store/auth';
import { useNavigate } from 'react-router-dom';
import { div } from 'framer-motion/client';

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

  const handleRegister=()=>{
    navigate('/register');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/user/login', formData, { withCredentials: true });

      if (response.status === 200) {
        const user = response.data.user;  // Assuming the response includes user details
        dispatch(login({ username: user.username, email: user.email }));
        alert('Login successful!');
        navigate('/dashboard'); // Redirect after successful login
      }
    } catch (error: any) {
      console.error('Error during login:', error);
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <button onClick={handleRegister}>Register</button>
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Login</h2>
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <button type="submit">Login</button>
    </form>
    </div>
  );
};

export default Login;
