import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Image } from 'react-native';
import { Button, Card, Paragraph } from 'react-native-paper';
import { useRouter } from 'expo-router';
import BackButton from '../../components/BackButton';

export default function LemonfitPadelScreen() {
  const router = useRouter();
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [fields, setFields] = useState<string[]>([]);
  const [rating, setRating] = useState(4.8);

  useEffect(() => {
    setOnlineUsers(Math.floor(Math.random() * 15) + 1);
    setFields(['Campo Central', 'Campo 2', 'Campo 3', 'Campo 4']);
    setRating(4.8);
  }, []);

  const handleReserve = () => {
    router.push('/book-court');
  };

  return (
    <ScrollView style={styles.container}>
      <BackButton />

      {/* Imagens locais */}
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.imageCarousel}>
        <Image source={require('../../assets/images/lemonfit-padel1.png')} style={styles.image} />
        <Image source={require('../../assets/images/lemonfit-padel2.png')} style={styles.image} />
      </ScrollView>

      <Text style={styles.title}>Lemonfit Padel</Text>
      <Text style={styles.location}>📍 Olaias</Text>

      <View style={styles.statsContainer}>
        <Text style={styles.rating}>⭐ {rating.toFixed(1)} / 5.0</Text>
        <Text style={styles.online}>🟢 {onlineUsers} jogadores online agora</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Paragraph style={styles.cardText}>Campos disponíveis:</Paragraph>
          {fields.map((f, i) => (
            <Text key={i} style={styles.fieldItem}>✅ {f}</Text>
          ))}
        </Card.Content>
      </Card>

      <Button mode="contained" onPress={handleReserve} style={styles.reserveButton}>
        Reservar Campo
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e8f5e9', padding: 15 },
  imageCarousel: { marginBottom: 10 },
  image: {
    width: 350,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginRight: 10,
  },
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
