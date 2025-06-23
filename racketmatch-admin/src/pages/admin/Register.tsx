import { useState, useEffect } from 'react';
import axios from 'axios';
import { register } from '../../services/authService';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleRegister = async () => {
    try {
      setLoading(true);
      await register({ name, email, password, role: 'admin' });
      alert('Conta admin criada com sucesso!');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Erro ao criar conta:', err.response?.data || err.message);
        alert('Erro ao criar conta');
      } else {
        console.error('Erro inesperado:', err);
        alert('Erro desconhecido ao criar conta');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 px-4">
      {/* 🌙 Botão no canto superior esquerdo */}
      <button
        onClick={() => {
          const html = document.documentElement;
          if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
          } else {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
          }
        }}
        className="absolute top-6 left-6 z-20 text-2xl text-gray-700 dark:text-gray-200 hover:scale-110 transition"
      >
        🌙
      </button>

      <div className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 border border-green-300 animate-fade-in text-gray-800 dark:text-gray-100">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-orange-500 drop-shadow-sm">
            📝 Criar Conta <span className="text-green-500">Admin</span>
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Apenas administradores autorizados
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              👤 Nome
            </label>
            <input
              id="name"
              type="text"
              placeholder="O teu nome"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              📧 Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="teu@email.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              🔒 Palavra-passe
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="new-password"
            />
          </div>
        </div>

        <button
          onClick={handleRegister}
          className="w-full mt-8 bg-gradient-to-r from-orange-500 to-green-500 text-white py-3 rounded-full font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition disabled:opacity-50"
          disabled={loading || !name || !email || !password}
        >
          {loading ? 'A criar conta...' : '✍️ Criar Conta'}
        </button>

        <p className="text-sm text-center mt-4">
          Já tens conta?{' '}
          <Link to="/login" className="text-orange-500 underline hover:text-green-500 transition">
            Inicia sessão
          </Link>
        </p>
      </div>
    </div>
  );
}
