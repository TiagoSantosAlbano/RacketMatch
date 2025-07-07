
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function CreateCourtPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      await axios.post(
        'http://localhost:5000/api/admin/courts',
        { name, location },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage('✅ campo criada com sucesso!');
      setTimeout(() => router.push('../admin-courts'), 1500);  
    } catch (err: any) {
      setMessage(err.response?.data?.message || '❌ Erro ao criar campo.');
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>➕ Criar Nova campo</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', marginBottom: 10, padding: 8 }}
          />
        </div>
        <div>
          <label>Localização:</label>
          <input
            type="text"
            value={location}
            required
            onChange={(e) => setLocation(e.target.value)}
            style={{ width: '100%', marginBottom: 10, padding: 8 }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>
          Criar campo
        </button>
        {message && <p style={{ marginTop: 15 }}>{message}</p>}
      </form>
    </div>
  );
}
