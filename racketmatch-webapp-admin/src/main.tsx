import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './AppRouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@context/AuthProvider';
import './index.css';  


 // ✅ Importa o contexto

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider> {/* ✅ Envolve a app com o provider */}
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
