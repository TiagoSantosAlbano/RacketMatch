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

  /* ─────────── BUSCAR DADOS DA QUADRA ─────────── */
  const fetchCourt = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const { data } = await axios.get(
        `http://localhost:5000/api/admin/courts/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setName(data.name);
      setLocation(data.location);
    } catch {
      setMessage('❌ Erro ao buscar dados da quadra.');
    } finally {
      setLoading(false);
    }
  };

  /* ─────────── ATUALIZAR QUADRA ─────────── */
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `http://localhost:5000/api/admin/courts/${id}`,
        { name, location },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessage('✅ Quadra atualizada!');

      // ✅ Caminho relativo funciona com expo-router
      setTimeout(() => {
        router.push('../');
      }, 1500);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Erro ao atualizar quadra.');
    }
  };

  useEffect(() => {
    if (id) fetchCourt();
  }, [id]);

  if (loading) return <p>🔄 Loading…</p>;

  return (
    <div style={{ padding: 30 }}>
      <h2>✏️ Editar Quadra</h2>

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
