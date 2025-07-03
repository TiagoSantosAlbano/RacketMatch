import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BackButton from '../components/BackButton';

export default function CreateOpenMatchScreen() {
  const router = useRouter();
  const [matchDate, setMatchDate] = useState('');
  const [matchTime, setMatchTime] = useState('');
  const [courtName, setCourtName] = useState('');
  const [courtLocation, setCourtLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateMatch = async () => {
    if (!matchDate || !matchTime || !courtName || !courtLocation) {
      Alert.alert('Erro', 'Preenche todos os campos.');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');

      await axios.post(
        'http://31.97.177.93:5000/api/matches',
        {
          match_date: matchDate,
          match_time: matchTime,
          court_name: courtName,
          court_location: courtLocation,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert('✅ Sucesso', 'Jogo criado com sucesso!');
      router.replace('/open-match'); // volta à lista
    } catch (err) {
      console.error('❌ Erro ao criar jogo:', err);
      Alert.alert('Erro', 'Não foi possível criar o jogo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <BackButton />
        <Text style={styles.title}>Criar Jogo Aberto 🎾</Text>

        <TextInput
          style={styles.input}
          placeholder="📅 Data (YYYY-MM-DD)"
          value={matchDate}
          onChangeText={setMatchDate}
        />
        <TextInput
          style={styles.input}
          placeholder="🕐 Hora (HH:MM)"
          value={matchTime}
          onChangeText={setMatchTime}
        />
        <TextInput
          style={styles.input}
          placeholder="🏟️ Nome do Campo"
          value={courtName}
          onChangeText={setCourtName}
        />
        <TextInput
          style={styles.input}
          placeholder="📍 Localização"
          value={courtLocation}
          onChangeText={setCourtLocation}
        />

        <Button
          mode="contained"
          style={styles.button}
          onPress={handleCreateMatch}
          loading={loading}
          disabled={loading}
        >
          Criar Jogo
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6fafe' },
  inner: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1b5e20', marginBottom: 20 },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 14,
    fontSize: 16,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 12,
    backgroundColor: '#1b5e20',
    borderRadius: 8,
  },
});
