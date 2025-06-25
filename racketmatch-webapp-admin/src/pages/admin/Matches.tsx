import { useEffect, useState } from 'react';
import { getMatches } from '../../services/matchService';

interface Match {
  _id: string;
  court: string;
  date: string;
  players: string[];
}

const MatchesPage = () => {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await getMatches();
        setMatches(data);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Matches</h1>
      <ul>
        {matches.map((match) => (
          <li key={match._id} className="border p-2 mb-2 rounded">
            <strong>Court:</strong> {match.court} <br />
            <strong>Date:</strong> {new Date(match.date).toLocaleString()} <br />
            <strong>Players:</strong> {match.players.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchesPage;
