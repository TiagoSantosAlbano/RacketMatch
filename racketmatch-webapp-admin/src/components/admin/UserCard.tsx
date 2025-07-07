interface UserCardProps {
  name: string;
  email: string;
  role?: string;
  avatarUrl?: string;
  onClick?: () => void;
}

export default function UserCard({
  name = 'Sem Nome',
  email = 'Sem Email',
  role = 'Utilizador',
  avatarUrl,
  onClick,
}: UserCardProps) {
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || 'User'
  )}&background=0D8ABC&color=fff`;

  return (
    <div
      className="flex items-center gap-4 p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md transition hover:shadow-lg cursor-pointer"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <img
        src={avatarUrl || fallbackAvatar}
        alt={`Avatar de ${name || 'Utilizador'}`}
        className="w-14 h-14 rounded-full object-cover border-2 border-green-500"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = fallbackAvatar;
        }}
      />
      <div className="flex flex-col min-w-0">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate max-w-[170px]">
          {name || 'Utilizador'}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[170px]">
          {email || '-'}
        </p>
        <span className="text-xs font-medium text-orange-500 bg-orange-100 dark:bg-orange-800 dark:text-orange-300 px-2 py-0.5 rounded mt-1 w-fit">
          {role}
        </span>
      </div>
    </div>
  );
}
