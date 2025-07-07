import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BookingsListScreen() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      const res = await api.get('/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(res.data);
    } catch {
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchReservations();
    }, [])
  );

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.courtName}>
        <Icon name="tennis" size={17} color="#20876b" /> {item.court?.name || 'Campo'}
      </Text>
      <Text style={styles.info}>
        <Icon name="map-marker" size={15} color="#ea3d59" /> {item.court?.location}
      </Text>
      <Text style={styles.info}>
        <Icon name="calendar" size={15} color="#20876b" />{' '}
        {item.date?.slice(0, 10)} {item.time}
      </Text>
      <Text style={styles.status}>
        Estado: <Text style={{ fontWeight: 'bold' }}>{item.status}</Text>
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Icon name="arrow-left" size={28} color="#207c2e" />
      </TouchableOpacity>

      {/* Botão de criar nova reserva */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/bookings/create')}
      >
        <Icon name="plus-circle" size={28} color="#207c2e" />
      </TouchableOpacity>
      <Text style={styles.title}>As Minhas Reservas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#20876b" style={{ marginTop: 40 }} />
      ) : reservations.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 30, color: '#888' }}>
          Ainda não tens reservas.
        </Text>
      ) : (
        <FlatList
          data={reservations}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={{ padding: 10 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6fafe' },
  backButton: {
    position: 'absolute',
    top: 13,
    left: 13,
    zIndex: 100,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 4,
    elevation: 5,
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#207c2e',
    marginLeft: 50, 
    marginTop: 16,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 13,
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  courtName: { fontSize: 16, fontWeight: 'bold', color: '#0a3535', marginBottom: 4 },
  info: { fontSize: 14, color: '#222', marginBottom: 3 },
  status: { fontSize: 14, color: '#555', marginTop: 5 },
  addButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    zIndex: 99,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    elevation: 5,
  }
});
