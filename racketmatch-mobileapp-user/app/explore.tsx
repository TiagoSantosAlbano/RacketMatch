import React from 'react';
import {
  StyleSheet,
  Image,
  ScrollView,
  Text,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card } from 'react-native-paper';

const clubs = [
  {
    name: 'Lemonfit Padel',
    location: 'Olaias',
    slug: 'lemonfit-padel',
    image: require('../assets/images/lemonfit-padel1.png'),
  },
  {
    name: 'Squash Olaias',
    location: 'Lisboa',
    slug: 'squash-olaias',
    image: require('../assets/images/squash-olaias.png'),
  },
];

export default function ExploreScreen() {
  const router = useRouter();

  const handleVisit = (slug: string) => {
    router.push(`/club/${slug}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Explorar Clubes</Text>

      {clubs.map((club, index) => (
        <Card key={index} style={styles.card}>
          <Image source={club.image} style={styles.cardImage} />
          <Card.Content style={styles.cardContent}>
            <Text style={styles.clubName}>{club.name}</Text>
            <Text style={styles.clubLocation}>{club.location}</Text>
            <Button
              mode="contained"
              onPress={() => handleVisit(club.slug)}
              style={styles.visitButton}
              labelStyle={styles.visitButtonLabel}
            >
              Visitar
            </Button>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#e8f5e9',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#2e7d32',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: screenWidth * 0.5,
    resizeMode: 'cover',
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  clubName: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#1b2a3b',
    marginBottom: 4,
  },
  clubLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  visitButton: {
    backgroundColor: '#1b2a3b',
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 6,
  },
  visitButtonLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
