import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/admin/Login';
import Register from './pages/admin/Register';
import Dashboard from './pages/admin/Dashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Ajuste essencial: adicionar o '/*' */}
      <Route path="/dashboard/*" element={<Dashboard />} />
      
      {/* Rota fallback global */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
