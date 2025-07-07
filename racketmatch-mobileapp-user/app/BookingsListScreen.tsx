import React, { useEffect, useState, useCallback } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Card, Paragraph, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BackButton from '../components/BackButton';

interface Booking {
  _id: string;
  court: {
    _id: string;
    name: string;
    location: string;
  };
  date: string;
  status?: string;
}

export default function BookingsListScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado. Faça login novamente.');

      const res = await axios.get('http://31.97.177.93:5000/api/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings(res.data);
    } catch (error: any) {
      console.error('Erro ao procurar reservas:', error?.response?.data || error);
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);


  const handleCancel = async (bookingId: string) => {
    Alert.alert(
      'Cancelar Reserva',
      'Tem certeza que deseja cancelar esta reserva?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              await axios.delete(`http://31.97.177.93:5000/api/bookings/${bookingId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              Alert.alert('Reserva cancelada!');
              fetchBookings();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível cancelar a reserva.');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => {
          setRefreshing(true);
          fetchBookings();
        }} />
      }
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <BackButton />
      <Text style={styles.title}>Minhas Reservas</Text>
      <Button mode="outlined" onPress={fetchBookings} style={styles.refreshButton}>
        Atualizar
      </Button>

      {loading ? (
        <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 20 }} />
      ) : bookings.length === 0 ? (
        <Text style={styles.noBookingText}>Ainda não tem reservas.</Text>
      ) : (
        bookings.map((booking) => (
          <Card key={booking._id} style={styles.card}>
            <Card.Content>
              <Paragraph style={styles.courtName}>{booking.court.name}</Paragraph>
              <Text style={styles.courtLocation}>{booking.court.location}</Text>
              <Text style={styles.date}>
                📅 {new Date(booking.date).toLocaleString()}
              </Text>
              {booking.status && (
                <Text style={[styles.status, booking.status === 'cancelada' && styles.statusCanceled]}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Text>
              )}
              {/* Botão cancelar apenas se reserva está ativa */}
              {booking.status !== 'cancelada' && (
                <Button
                  mode="outlined"
                  onPress={() => handleCancel(booking._id)}
                  style={{ marginTop: 10, borderColor: '#d32f2f' }}
                  textColor="#d32f2f"
                >
                  Cancelar Reserva
                </Button>
              )}
            </Card.Content>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#e8f5e9' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#2e7d32', textAlign: 'center', marginBottom: 15 },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    padding: 6,
  },
  courtName: { fontSize: 17, fontWeight: 'bold', color: '#1b5e20' },
  courtLocation: { fontSize: 14, color: '#666', marginBottom: 6 },
  date: { fontSize: 15, color: '#388e3c', marginBottom: 2 },
  status: { fontSize: 14, color: '#2196f3', marginTop: 4, fontWeight: 'bold' },
  statusCanceled: { color: '#d32f2f' },
  noBookingText: { color: '#888', textAlign: 'center', fontSize: 16, marginTop: 20 },
  refreshButton: { alignSelf: 'center', marginVertical: 6 },
});
