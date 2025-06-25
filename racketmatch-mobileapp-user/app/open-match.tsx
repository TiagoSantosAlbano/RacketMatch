import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BackButton from '../components/BackButton';
import { useRouter } from 'expo-router';

interface Match {
  _id: string;
  match_date: string;
  match_time: string;
  court_name: string;
  court_location: string;
  players: string[];
  status: string;
}

export default function OpenMatchScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const res = await axios.get('http://localhost:5000/api/matches', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filtered = res.data.filter((m: Match) => m.players.length < 4);
        setMatches(filtered);
      } catch (error) {
        console.error('Erro ao carregar partidas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleJoinMatch = async (matchId: string) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.post(
        `http://localhost:5000/api/matches/${matchId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Sucesso', 'Você entrou na partida!');
      router.push(`/chat?matchId=${matchId}`);
    } catch (err) {
      console.error('Erro ao entrar na partida:', err);
      Alert.alert('Erro', 'Não foi possível entrar na partida.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Jogos Abertos 🎾</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : matches.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma partida com vagas no momento.</Text>
      ) : (
        matches.map((match) => (
          <Card key={match._id} style={styles.card}>
            <Card.Content>
              <Text style={styles.cardTitle}>📍 {match.court_name} - {match.court_location}</Text>
              <Text style={styles.detail}>📅 {match.match_date} às ⏰ {match.match_time}</Text>
              <Text style={styles.detail}>Jogadores: {match.players.length}/4</Text>
              <Text style={styles.detail}>Status: {match.status}</Text>
              <Button mode="contained" style={styles.button} onPress={() => handleJoinMatch(match._id)}>
                Juntar-se
              </Button>
            </Card.Content>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9',
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
    marginBottom: 15,
    borderRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1b5e20',
  },
  detail: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#2e7d32',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
});
