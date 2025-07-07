import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function EditCourtPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  
  const fetchCourt = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const { data } = await axios.get(
        `http://31.97.177.93:5000/api/admin/courts/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setName(data.name);
      setLocation(data.location);
    } catch {
      setMessage('❌ Erro ao procurar dados da campo.');
    } finally {
      setLoading(false);
    }
  };

  
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `http://31.97.177.93:5000/api/admin/courts/${id}`,
        { name, location },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessage('✅ campo atualizada!');

      setTimeout(() => {
        router.push('../');
      }, 1500);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Erro ao atualizar campo.');
    }
  };

  useEffect(() => {
    if (id) fetchCourt();
  }, [id]);

  if (loading) return <p>🔄 Loading…</p>;

  return (
    <div style={{ padding: 30 }}>
      <h2>✏️ Editar campo</h2>

      <form onSubmit={handleUpdate} style={{ maxWidth: 400 }}>
        <label>Nome:</label>
        <input
          value={name}
          required
          onChange={e => setName(e.target.value)}
          style={{ width: '100%', marginBottom: 10, padding: 8 }}
        />

        <label>Localização:</label>
        <input
          value={location}
          required
          onChange={e => setLocation(e.target.value)}
          style={{ width: '100%', marginBottom: 10, padding: 8 }}
        />

        <button type="submit" style={{ padding: '10px 20px' }}>Atualizar</button>
        {message && <p style={{ marginTop: 15 }}>{message}</p>}
      </form>
    </div>
  );
}
