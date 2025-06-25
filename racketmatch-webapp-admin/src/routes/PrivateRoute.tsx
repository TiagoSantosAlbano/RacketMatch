import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated } = useAuth();

  // ⚠️ Opcional: adicionar lógica de loading inicial, se implementares isso no AuthProvider
  // if (isLoading) {
  //   return <div className="p-6 text-center">A verificar sessão...</div>;
  // }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
