import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../components/BackButton';

export default function MyReservationsScreen() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      const res = await api.get('/reservations/mine', {
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
        <Icon name="tennis" size={17} color="#20876b" /> {item.court?.name || 'campo'}
      </Text>
      <Text style={styles.info}>
        <Icon name="map-marker" size={15} color="#ea3d59" /> {item.court?.location}
      </Text>
      <Text style={styles.info}>
        <Icon name="calendar" size={15} color="#20876b" /> {item.date} {item.hour}
      </Text>
      <Text style={styles.status}>
        Estado: <Text style={{ fontWeight: 'bold' }}>{item.status}</Text>
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <BackButton />
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
  title: { fontSize: 23, fontWeight: 'bold', color: '#207c2e', marginLeft: 20, marginTop: 12, marginBottom: 10 },
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
});
