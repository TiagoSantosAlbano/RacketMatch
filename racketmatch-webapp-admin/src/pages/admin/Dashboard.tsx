import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import Courts from './Courts';
import Matches from './Matches';
import Users from './Users';
import Payments from './Payments';
import { useAuth } from '../../hooks/useAuth';

export default function Dashboard() {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Sidebar de navegação */}
      <Sidebar />

      {/* Área principal */}
      <div className="flex-1 p-6 sm:p-8">
        {/* Cabeçalho com título e botão de logout */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-green-600 dark:text-green-400">
            🎾 Painel de Administração
          </h1>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold transition"
          >
            🔓 Terminar Sessão
          </button>
        </div>

        {/* Rotas internas do painel */}
        <Routes>
          {/* Redireciona para "courts" se estiver em /dashboard */}
          <Route index element={<Navigate to="courts" replace />} />
          <Route path="courts" element={<Courts />} />
          <Route path="matches" element={<Matches />} />
          <Route path="users" element={<Users />} />
          <Route path="payments" element={<Payments />} />
 

          {/* Fallback interno do painel */}
          <Route path="*" element={<Navigate to="courts" replace />} />
        </Routes>
      </div>
    </div>
  );
}
