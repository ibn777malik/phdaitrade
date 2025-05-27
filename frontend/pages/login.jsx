import React, { useState } from 'react';
import { apiPost } from '../utils/apiClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await apiPost('/auth/login', { email, password });
      // Save JWT token to cookie or localStorage here
      alert('Login successful!');
      // Redirect or update app state accordingly
    } catch (err) {
      setError('Login failed');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          className="w-full p-2 mb-3 border rounded"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          className="w-full p-2 mb-3 border rounded"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-600 mb-3">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
