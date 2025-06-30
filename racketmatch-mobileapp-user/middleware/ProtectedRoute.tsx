import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return null;

  return token ? <>{children}</> : <Redirect href="/login" />;
};

export default ProtectedRoute;
