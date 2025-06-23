import { useEffect, useState } from 'react';
import { getUsers } from '../../services/userService';

interface User {
  _id: string;
  username: string;
  email: string;
}

const CommunityPage = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Community</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id} className="border p-2 mb-2 rounded">
            <strong>{user.username}</strong> - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommunityPage;
