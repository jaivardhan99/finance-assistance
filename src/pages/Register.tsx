import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../store/auth'; // same action used for setting user info
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        console.log(formData)
      const response = await axios.post('http://localhost:3000/user/register', formData, {
        withCredentials: true,
      });

      if(response.data.message=="UserExists"){
        alert('User Exists')
      }
      else{
        const user = response.data.user || {
          username: formData.username,
          email: formData.email,
        };

        // Save user in Redux store
        dispatch(login({ username: user.username, email: user.email }));
        console.log("HEYY")
        alert('Registration successful!');
        navigate('/dashboard'); // Redirect after successful registration
      
    }} catch (error: any) {
      console.error('Error submitting form:', error);
      alert(error.response?.data?.message || 'User Exists');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Register</h2>

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
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
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

      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
