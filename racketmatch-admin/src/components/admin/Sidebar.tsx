import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { path: 'courts', label: 'Courts', icon: '🏟️' },
    { path: 'matches', label: 'Matches', icon: '🎾' },
    { path: 'users', label: 'Users', icon: '👥' },
    { path: 'payments', label: 'Payments', icon: '💸' },
    { path: 'finance', label: 'Finance Dashboard', icon: '📊' },
    { path: 'report', label: 'Financial Report', icon: '📈' },
    { path: 'tenants', label: 'Tenants', icon: '🏢' },
  ];

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white px-6 py-8 shadow-md">
      <h1 className="text-2xl font-extrabold mb-10 tracking-tight text-green-400">
        🎯 RacketMatch
      </h1>

      <nav className="flex flex-col gap-3">
        {menu.map((item) => {
          const fullPath = `/dashboard/${item.path}`;
          const isActive = location.pathname === fullPath;
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
    </aside>
  );
}
