import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph, Button, Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Booking {
  id: string;
  type: string;
  date: string;
  location: string;
  status: string;
  basePrice?: number;
}

const BookingsScreen = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('authToken');
      const res = await axios.get('http://localhost:5000/api/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          setError('Você precisa estar logado para ver suas marcações.');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBookings(response.data);
      } catch (error) {
        console.error('Erro ao buscar marcações:', error);
        setError('Falha ao carregar as marcações. Tente novamente mais tarde.');
        setBookings([
          {
            id: '1',
            type: 'Reserva de Material',
            date: '20 de Abril, 2025 - 14:00',
            location: 'Squash Olaias, Lisboa',
            status: 'Confirmado',
            basePrice: 10,
          },
          {
            id: '2',
            type: 'Jogo Aberto',
            date: '22 de Abril, 2025 - 18:00',
            location: 'Lemonfit Padel, Olaias',
            status: 'Pendente',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleViewBooking = (bookingId: string) => {
    router.push({
      pathname: '/bookings/confirmation/[id]', // ✅ Corrigido aqui (sem "s")
      params: { id: bookingId },
    });
  };

  const getFinalPrice = (basePrice: number | undefined) => {
    if (!basePrice) return null;
    return user?.isPremium ? (basePrice * 0.9).toFixed(2) : basePrice.toFixed(2);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Minhas Marcações</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1A2B3C" />
            <Text style={styles.loadingText}>Carregando marcações...</Text>
          </View>
        ) : (
          <>
            {bookings.length === 0 ? (
              <Text style={styles.emptyText}>Você não tem marcações no momento.</Text>
            ) : (
              bookings.map((booking) => (
                <Card key={booking.id} style={styles.bookingCard}>
                  <Card.Content>
                    <View style={styles.bookingContent}>
                      <Icon name="calendar-check" size={30} color="#1A2B3C" />
                      <View style={styles.bookingDetails}>
                        <Title style={styles.bookingTitle}>{booking.type}</Title>
                        <Paragraph style={styles.bookingDescription}>Data: {booking.date}</Paragraph>
                        <Text style={styles.bookingInfo}>Local: {booking.location}</Text>
                        <Text style={styles.bookingInfo}>Status: {booking.status}</Text>

                        {booking.basePrice && (
                          <Text style={styles.bookingInfo}>
                            Preço: {getFinalPrice(booking.basePrice)}€{' '}
                            {user?.isPremium && <Text style={{ color: 'green' }}>(-10% Premium)</Text>}
                          </Text>
                        )}

                        {user?.isPremium && (
                          <Text style={styles.premiumTag}>🏆 Prioridade Premium</Text>
                        )}
                      </View>
                    </View>
                    <Button
                      mode="contained"
                      style={styles.viewButton}
                      onPress={() => handleViewBooking(booking.id)}
                    >
                      Ver Detalhes
                    </Button>
                  </Card.Content>
                </Card>
              ))
            )}
          </>
        )}

        <View style={styles.bottomNav}>
          <Icon name="home" size={25} color="#888" onPress={() => router.push('/home')} />
          <Icon name="account-group" size={25} color="#888" onPress={() => router.push('/community')} />
          <Icon name="account" size={25} color="#888" onPress={() => router.push('/profile')} />
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {error}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#1A2B3C',
    padding: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  bookingCard: { marginHorizontal: 15, marginVertical: 10, elevation: 4, borderRadius: 10 },
  bookingContent: { flexDirection: 'row', alignItems: 'center' },
  bookingDetails: { flex: 1, marginLeft: 10 },
  bookingTitle: { fontSize: 16, fontWeight: 'bold' },
  bookingDescription: { fontSize: 12, color: '#666', marginVertical: 5 },
  bookingInfo: { fontSize: 12, color: '#888' },
  premiumTag: { fontSize: 12, color: '#28a745', marginTop: 5, fontWeight: '600' },
  viewButton: { marginTop: 10, backgroundColor: '#1A2B3C' },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#666' },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  snackbar: { backgroundColor: '#D32F2F' },
});

export default BookingsScreen;
