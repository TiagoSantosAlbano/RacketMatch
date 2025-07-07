import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get('http://31.97.177.93:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Erro ao carregar utilizadores', err);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Tens a certeza que queres remover este utilizador?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://31.97.177.93:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user: any) => user._id !== id));
    } catch (err) {
      alert('Erro ao remover utilizador.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h2>👥 Utilizadores</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Nível</th>
            <th>Premium</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u: any) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.skill_level}</td>
              <td>{u.isPremium ? '✅' : '❌'}</td>
              <td>
                <button onClick={() => deleteUser(u._id)}>🗑️ Apagar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
