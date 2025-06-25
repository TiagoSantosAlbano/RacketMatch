import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  Alert,
} from 'react-native';
import { Button, Card, Paragraph } from 'react-native-paper';
import BackButton from '../../components/BackButton';
import { useRouter } from 'expo-router';

const clubData: Record<
  string,
  {
    name: string;
    location: string;
    image: string;
    rating: number;
    fields: string[];
  }
> = {
  'lemonfit-padel': {
    name: 'Lemonfit Padel',
    location: 'Olaias',
    image: 'https://example.com/padel.jpg',
    rating: 4.8,
    fields: ['Campo Central', 'Campo 2', 'Campo 3', 'Campo 4'],
  },
  'squash-olaias': {
    name: 'Squash Olaias',
    location: 'Lisboa',
    image: 'https://example.com/squash.jpg',
    rating: 4.5,
    fields: ['Quadra A', 'Quadra B'],
  },
};

export default function ClubScreen() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [club, setClub] = useState<typeof clubData['lemonfit-padel'] | null>(
    null
  );

  useEffect(() => {
    if (typeof slug === 'string' && clubData[slug]) {
      setClub(clubData[slug]);
    } else {
      Alert.alert('Erro', 'Clube não encontrado.');
    }
    setOnlineUsers(Math.floor(Math.random() * 10) + 1);
  }, [slug]);

  if (!club) return null;

  return (
    <ScrollView style={styles.container}>
      <BackButton />
      <Image source={{ uri: club.image }} style={styles.image} />
      <Text style={styles.title}>{club.name}</Text>
      <Text style={styles.location}>📍 {club.location}</Text>

      <View style={styles.statsContainer}>
        <Text style={styles.rating}>⭐ {club.rating} / 5.0</Text>
        <Text style={styles.online}>🟢 {onlineUsers} jogadores online agora</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Paragraph style={styles.cardText}>Campos disponíveis:</Paragraph>
          {club.fields.map((f, i) => (
            <Text key={i} style={styles.fieldItem}>✅ {f}</Text>
          ))}
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={() => router.push('/book-court')}
        style={styles.reserveButton}
      >
        Reservar Campo
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e8f5e9', padding: 15 },
  image: { width: '100%', height: 200, borderRadius: 10 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 10, color: '#2e7d32' },
  location: { fontSize: 14, color: '#666' },
  statsContainer: { marginVertical: 15 },
  rating: { fontSize: 18, color: '#ffb300', fontWeight: 'bold' },
  online: { fontSize: 14, color: '#388e3c' },
  card: { marginVertical: 10, backgroundColor: '#fff', borderRadius: 10 },
  cardText: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  fieldItem: { fontSize: 14, marginBottom: 4, color: '#444' },
  reserveButton: { backgroundColor: '#2e7d32', marginTop: 20 },
});
