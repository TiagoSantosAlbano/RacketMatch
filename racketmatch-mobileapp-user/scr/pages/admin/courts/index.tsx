import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function CourtListPage() {
  const [courts, setCourts] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchCourts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get('http://31.97.177.93:5000/api/admin/courts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourts(res.data);
    } catch (err) {
      console.error('Erro ao procurar campos', err);
      setMessage('❌ Erro ao carregar campos.');
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('adminToken');
    const confirm = window.confirm('Tens a certeza que queres apagar esta campo?');
    if (!confirm) return;

    setLoading(true);
    try {
      await axios.delete(`http://31.97.177.93:5000/api/admin/courts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('✅ campo removida com sucesso!');
      setCourts((prev) => prev.filter((court: any) => court._id !== id));
    } catch (err) {
      console.error(err);
      setMessage('❌ Erro ao apagar campo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h2>🏟️ Gestão de campos</h2>

      <button
        onClick={() => router.push('./edit/create')}
        style={{ marginBottom: 20 }}
      >
        ➕ Nova campo
      </button>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {loading && <p>⏳ A processar...</p>}

      <table border={1} cellPadding={10} width="100%">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Localização</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {courts.map((court: any) => (
            <tr key={court._id}>
              <td>{court.name}</td>
              <td>{court.location}</td>
              <td>
                <button
                  onClick={() => router.push(`./edit/${court._id}`)}
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => handleDelete(court._id)}
                  style={{ marginLeft: 10, color: 'red' }}
                >
                  🗑️ Apagar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
