import React from 'react';
import { AuthProvider } from './context/authContext';
import { Slot } from 'expo-router';

export default function App() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
