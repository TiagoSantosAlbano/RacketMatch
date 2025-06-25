// src/AppRouter.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/admin/Login';
import Register from './pages/admin/Register';
import Dashboard from './pages/admin/Dashboard';
import Courts from './pages/admin/Courts';
import Matches from './pages/admin/Matches';
import Users from './pages/admin/Users';
import Payments from './pages/admin/Payments';
import PrivateRoute from './routes/PrivateRoute';

export default function AppRouter() {
  return (
    <Routes>
      {/* Redireciona raiz para login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Rotas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rotas protegidas */}
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/courts"
        element={
          <PrivateRoute>
            <Courts />
          </PrivateRoute>
        }
      />

      <Route
        path="/matches"
        element={
          <PrivateRoute>
            <Matches />
          </PrivateRoute>
        }
      />

      <Route
        path="/users"
        element={
          <PrivateRoute>
            <Users />
          </PrivateRoute>
        }
      />

      <Route
        path="/payments"
        element={
          <PrivateRoute>
            <Payments />
          </PrivateRoute>
        }
      />

      {/* Fallback para rotas inválidas */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
