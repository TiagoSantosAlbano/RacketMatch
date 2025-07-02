import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { checkIfAdminExists, loginAdmin } from '../../services/adminService';
import { useAuth } from '../../hooks/useAuth';

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Ativa dark mode se já estiver guardado
  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Verifica se já existe um admin no sistema
  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const exists = await checkIfAdminExists();
        setAdminExists(exists);
        if (!exists) navigate('/register');
      } catch (error) {
        console.error(error);
        setAdminExists(true);
        setError('Erro ao verificar o sistema. Verifica o backend.');
      }
    };
    verifyAdmin();
  }, [navigate]);

  // Alternar tema claro/escuro
  const toggleDarkMode = () => {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    html.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  };

  // Submissão do formulário de login
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await loginAdmin(form);
      console.log("RESPOSTA BACKEND:", res); // Debug
      login(res.token, res.user);
      console.log("Login no contexto feito, token:", res.token, "user:", res.user); // Debug
      navigate('/dashboard');
      console.log("NAVEGOU para dashboard"); // Debug
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Credenciais inválidas.');
      } else {
        setError('Erro inesperado. Tenta novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (adminExists === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-green-800 text-lg font-semibold px-4">
        Verificando acesso...
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 px-4 animate-fade-in">
      {/* Botão Dark Mode */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 left-4 z-10 text-2xl text-gray-600 dark:text-gray-300 hover:scale-110 transition"
        title="Alternar modo"
        type="button"
        tabIndex={-1}
      >
        🌙
      </button>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-8 border border-green-300 dark:border-gray-600 text-gray-800 dark:text-gray-100"
        autoComplete="on"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-green-700 dark:text-green-400">
            🎾 RacketMatch <span className="text-orange-500">Backoffice</span>
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Acesso restrito a administradores 🛡️
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              📧 Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="exemplo@email.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={loading}
              autoComplete="email"
              required
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              🔒 Password
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              disabled={loading}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-[42px] text-xl text-gray-500 dark:text-gray-300"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? "Esconder password" : "Mostrar password"}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* Botão de login */}
        <button
          type="submit"
          disabled={loading || !form.email || !form.password}
          className="w-full mt-8 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-full font-semibold shadow-md hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? 'A entrar...' : '🔓 Entrar'}
        </button>

        {/* Botão de registo */}
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="w-full mt-3 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:opacity-90 transition disabled:opacity-50"
          disabled={loading}
        >
          ✍️ Criar Conta
        </button>

        {/* Mensagem de erro */}
        {error && (
          <div className="text-red-600 text-sm text-center mt-4">{error}</div>
        )}
      </form>
    </div>
  );
}
