interface UserCardProps {
  name: string;
  email: string;
  role?: string;
  avatarUrl?: string;
}

export default function UserCard({ name, email, role = 'Utilizador', avatarUrl }: UserCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md transition hover:shadow-lg">
      <img
        src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`}
        alt={`Avatar de ${name}`}
        className="w-14 h-14 rounded-full object-cover border-2 border-green-500"
      />
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{email}</p>
        <span className="text-xs font-medium text-orange-500 bg-orange-100 dark:bg-orange-800 dark:text-orange-300 px-2 py-0.5 rounded mt-1 w-fit">
          {role}
        </span>
      </div>
    </div>
  );
}
