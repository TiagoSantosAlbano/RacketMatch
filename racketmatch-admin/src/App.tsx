import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/admin/Login.js';
import Register from './pages/admin/Register.js';
import Dashboard from './pages/admin/Dashboard.js';
// adiciona outras rotas aqui...

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* outras rotas */}
    </Routes>
  );
}
