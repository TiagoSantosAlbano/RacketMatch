// App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/admin/Login';
import Register from './pages/admin/Register';
import Dashboard from './pages/admin/Dashboard';
import { useTheme } from './hooks/useTheme';
// ✅

export default function App() {
  const { theme } = useTheme(); // ✅

  return (
    <div className={theme === 'dark' ? 'dark' : ''}> {/* ✅ Aplica classe global */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}
