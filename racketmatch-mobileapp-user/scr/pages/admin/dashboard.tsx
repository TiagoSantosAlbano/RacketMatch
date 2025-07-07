import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useAdminAuth } from '../../../middleware/withAdminAuth';


type StatsType = {
  users: number;
  premiumUsers: number;
  courts: number;
  bookings: number;
  openMatches: number;
  communityPosts: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsType | null>(null);
  const router = useRouter();

  useAdminAuth(); 

  useEffect(() => {
    const fetchStats = async () => {
      const token = await localStorage.getItem('adminToken');
      const res = await axios.get('http://localhost:5000/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    };

    fetchStats();
  }, []);

  const handleLogout = async () => {
    await localStorage.removeItem('adminToken');
    router.push('/admin-login');
  };

  if (!stats) return <p>🔄 Carregando dados do dashboard...</p>;

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h1>📊 Painel Administrativo do RacketMatch</h1>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>👤 Utilizadores: <strong>{stats.users}</strong></li>
        <li>🏆 Premium: <strong>{stats.premiumUsers}</strong></li>
        <li>🏟️ campos: <strong>{stats.courts}</strong></li>
        <li>📅 Reservas: <strong>{stats.bookings}</strong></li>
        <li>🧑‍🤝‍🧑 Open Matches: <strong>{stats.openMatches}</strong></li>
        <li>🗨️ Posts Comunidade: <strong>{stats.communityPosts}</strong></li>
      </ul>

      <button
        onClick={handleLogout}
        style={{
          marginTop: 30,
          padding: '10px 20px',
          backgroundColor: '#d9534f',
          color: '#fff',
          border: 'none',
          borderRadius: 5,
          cursor: 'pointer'
        }}
      >
        🚪 Terminar Sessão
      </button>
    </div>
  );
}
