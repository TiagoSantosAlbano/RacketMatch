import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../config/api';
import BackButton from '../components/BackButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OpenMatchScreen() {
  const router = useRouter();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };
    fetchUserId();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await api.get('/matches');
      setMatches(res.data);
    } catch (err) {
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchMatches();
    }, [])
  );

  const handleJoin = async (matchId: string) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      await api.post(`/matches/${matchId}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Sucesso', 'Entraste no jogo!');
      fetchMatches();
    } catch (err: any) {
      Alert.alert('Erro', err?.response?.data?.message || 'Erro ao entrar no jogo.');
    }
  };

  const handlePayWithPayPal = async (matchId: string, amount: number) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const { data } = await api.post(
        '/paypal/create-payment',
        { matchId, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const approvalUrl = data.approvalUrl;
      if (approvalUrl) {
        if (Platform.OS === 'web') {
          window.open(approvalUrl, '_blank');
        } else {
          Linking.openURL(approvalUrl);
        }
      }
    } catch (err) {
      Alert.alert('Erro', 'Erro ao iniciar pagamento PayPal.');
    }
  };

  const renderItem = ({ item }: { item: any }) => {

    const alreadyJoined = !!item.players?.find((p: any) =>
      String(typeof p === 'string' ? p : p?._id) === String(userId)
    );

    const alreadyPaid = item.paidPlayers?.find((p: any) =>
      String(typeof p === 'string' ? p : p?._id) === String(userId)
    );


    const amount = item.courtPrice
      ? Number(item.courtPrice) / Math.max(item.players?.length || 1, 1)
      : 0;

    return (
      <View style={styles.matchCard}>
        <Text style={styles.matchTitle}>
          <Icon name="tennis" size={17} color="#20876b" />{' '}
          {item.title || item.court_name || 'Campo'}
        </Text>
        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
          <Icon name="calendar" size={16} color="#20876b" />
          <Text style={styles.matchInfo}>
            {'  '}
            {item.date || item.match_date} {item.hour || item.match_time}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <Icon name="map-marker" size={16} color="#ea3d59" />
          <Text style={styles.matchInfo}>
            {'  '}
            {item.location || item.court_location}
          </Text>
        </View>
        {/* Participantes */}
        <View style={{ marginBottom: 8 }}>
          <Text style={{ fontWeight: 'bold', color: '#20876b', marginBottom: 2 }}>Participantes:</Text>
          {(item.players || []).map((p: any, i: number) => (
            <Text key={p._id || p} style={{ marginLeft: 5 }}>
              <Icon name="account" size={14} />{' '}
              {typeof p === 'string' ? p : p.name || p.email || p._id}
              {userId && String(typeof p === 'string' ? p : p?._id) === String(userId) ? " (Tu)" : ""}
            </Text>
          ))}
        </View>
        {/* Botão Entrar */}
        {!alreadyJoined && (
          <TouchableOpacity
            onPress={() => handleJoin(item._id)}
            style={{ marginTop: 10, backgroundColor: '#207c2e', padding: 8, borderRadius: 6 }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Entrar</Text>
          </TouchableOpacity>
        )}
        {/* Botão PayPal */}
        {alreadyJoined && !alreadyPaid && amount > 0 && (
          <>
            <Text style={{ marginTop: 10, fontWeight: 'bold', color: '#e38c06', textAlign: 'center' }}>
              Falta pagar: {amount.toFixed(2)}€
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#ffc439',
                padding: 12,
                borderRadius: 8,
                alignItems: 'center',
                marginTop: 10,
              }}
              onPress={() => handlePayWithPayPal(item._id, amount)}
            >
              <Text style={{ fontWeight: 'bold', color: '#222', fontSize: 16 }}>
                Pagar {amount.toFixed(2)}€ com PayPal
              </Text>
            </TouchableOpacity>
          </>
        )}
        {/* Pagamento efetuado */}
        {alreadyJoined && alreadyPaid && (
          <Text style={{ marginTop: 10, color: '#207c2e', fontWeight: 'bold', textAlign: 'center' }}>
            Pagamento efetuado
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <View style={styles.headerRow}>
        <Text style={styles.title}>Jogos Abertos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/create-open-match')}
        >
          <Icon name="plus-circle" size={28} color="#207c2e" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#20876b" style={{ marginTop: 40 }} />
      ) : matches.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 30, color: '#888' }}>
          Nenhum jogo aberto encontrado.
        </Text>
      ) : (
        <FlatList
          data={matches}
          renderItem={renderItem}
          keyExtractor={(_, idx) => idx.toString()}
          contentContainerStyle={{ padding: 10 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6fafe' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 24,
    paddingBottom: 10,
  },
  title: { fontSize: 23, fontWeight: 'bold', color: '#207c2e' },
  addButton: { padding: 4 },
  matchCard: {
    backgroundColor: '#fff',
    marginBottom: 13,
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  matchTitle: { fontSize: 16, fontWeight: 'bold', color: '#0a3535', marginBottom: 7 },
  matchInfo: { fontSize: 14, color: '#222', marginLeft: 2 },
});
