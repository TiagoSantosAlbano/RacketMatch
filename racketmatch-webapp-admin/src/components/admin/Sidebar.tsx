import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';

export default function Sidebar() {
  const location = useLocation();
  const { toggleTheme } = useTheme();

  const menu = [
    { path: 'courts', label: 'Courts', icon: '🏟️' },
    { path: 'matches', label: 'Matches', icon: '🎾' },
    { path: 'users', label: 'Users', icon: '👥' },
    { path: 'bookings', label: 'Bookings', icon: '📝' }, 
  ];

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white px-6 py-8 shadow-md flex flex-col justify-between">
      {/* TOPO DO MENU */}
      <div>
        <h1 className="text-2xl font-extrabold mb-10 tracking-tight text-green-400">
          🎯 RacketMatch
        </h1>

        <nav className="flex flex-col gap-3">
          {menu.map((item) => {
            const fullPath = `/dashboard/${item.path}`;
            const isActive = location.pathname.startsWith(fullPath);
            return (
              <Link
                key={item.path}
                to={fullPath}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 
                  ${isActive
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* BOTÃO DARK MODE FIXADO EM BAIXO */}
      <div className="mt-6">
        <button
          onClick={toggleTheme}
          className="w-full text-left px-4 py-2 rounded-md text-white hover:text-yellow-400 transition text-xl"
          aria-label="Alternar Modo Escuro"
          aria-pressed="false"
        >
          🌙 Modo Escuro
        </button>
      </div>
    </aside>
  );
}
