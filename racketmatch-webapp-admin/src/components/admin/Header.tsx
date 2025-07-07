import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const { user, logout } = useAuth();

  // avatarUrl dinâmico sempre pelo nome do usuário
  const avatarUrl = user?.name
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=20876b&color=fff`
    : '';

  return (
    <header className="flex items-center justify-between bg-white/90 dark:bg-gray-800/90 backdrop-blur-md px-6 py-4 border-b border-gray-200 dark:border-gray-700 rounded-xl shadow-sm mb-6">
      <div className="flex items-center gap-3">
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt={user?.name ? `Avatar de ${user.name}` : 'Avatar'}
            className="w-10 h-10 rounded-full border-2 border-green-400 hidden sm:block"
          />
        )}
        <div>
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">
            🎾 RacketMatch Backoffice
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Bem-vindo{user?.name ? `, ${user.name}` : ''} 👋
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:block text-sm text-gray-500 dark:text-gray-300">
          {user?.email || '—'}
        </div>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-red-400"
          aria-label="Terminar Sessão"
        >
          🔓 Terminar Sessão
        </button>
      </div>
    </header>
  );
}
