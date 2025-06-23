import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Button, Card, Paragraph } from 'react-native-paper';
import BackButton from '../components/BackButton';

export default function PremiumScreen() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const res = await axios.get('http://localhost:5000/api/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsPremium(res.data.isPremium);
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const activatePremium = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.post('http://localhost:5000/api/activate-premium', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Sucesso', 'Premium ativado com sucesso!');
      setIsPremium(true);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível ativar o Premium.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackButton />
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>RacketMatch Premium 🎾</Text>
          <Paragraph style={styles.paragraph}>💰 3,99€/mês</Paragraph>
          <Paragraph style={styles.paragraph}>✅ 10% de desconto no aluguer de material</Paragraph>
          <Paragraph style={styles.paragraph}>🔥 Prioridade no matching com outros jogadores</Paragraph>
          <Paragraph style={styles.paragraph}>🎯 Prioridade na reserva de campos</Paragraph>

          {isPremium ? (
            <Text style={styles.success}>Já és membro Premium! 🏆</Text>
          ) : (
            <Button
              mode="contained"
              onPress={activatePremium}
              style={styles.button}
            >
              Ativar Premium
            </Button>
          )}
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9',
    padding: 20,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
  card: {
    borderRadius: 12,
    elevation: 5,
    backgroundColor: '#fff',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: 15,
  },
  paragraph: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#2e7d32',
  },
  success: {
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#2e7d32',
  },
});
