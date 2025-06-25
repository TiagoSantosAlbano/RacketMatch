import { StyleSheet, Image, ScrollView, Text } from 'react-native'; // View removido
import { useRouter } from 'expo-router';
import { Button, Card } from 'react-native-paper';

export default function ExploreScreen() {
  const router = useRouter();

  const handleVisit = (slug: string) => {
    router.push(`/club/${slug}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Explorar Clubes</Text>

      {/* Lemonfit Padel */}
      <Card style={styles.card}>
        <Image
          source={require('../assets/images/lemonfit-padel1.png')}
          style={styles.cardImage}
        />
        <Card.Content style={styles.cardContent}>
          <Text style={styles.clubName}>Lemonfit Padel</Text>
          <Text style={styles.clubLocation}>Olaias</Text>
          <Button
            mode="contained"
            onPress={() => handleVisit('lemonfit-padel')}
            style={styles.visitButton}
          >
            Visitar
          </Button>
        </Card.Content>
      </Card>

      {/* Squash Olaias */}
      <Card style={styles.card}>
        <Image
          source={require('../assets/images/squash-olaias.png')}
          style={styles.cardImage}
        />
        <Card.Content style={styles.cardContent}>
          <Text style={styles.clubName}>Squash Olaias</Text>
          <Text style={styles.clubLocation}>Olaias</Text>
          <Button
            mode="contained"
            onPress={() => handleVisit('squash-olaias')}
            style={styles.visitButton}
          >
            Visitar
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#e8f5e9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2e7d32',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  clubName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
  },
  clubLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  visitButton: {
    backgroundColor: '#1b2a3b',
    borderRadius: 20,
    paddingHorizontal: 20,
  },
});
