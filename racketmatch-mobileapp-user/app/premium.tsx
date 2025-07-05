import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Text, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Button, Card, Paragraph } from 'react-native-paper';
import BackButton from '../components/BackButton';
import Entypo from 'react-native-vector-icons/Entypo';

const PAYPAL_LINK = "https://www.paypal.com/ncp/payment/6SXUMFZE22QRE";
const API_URL = 'http://localhost:5000';

export default function PremiumScreen() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const res = await axios.get(`${API_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsPremium(res.data.isPremium);
        } else {
          setIsPremium(false);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        setIsPremium(false);
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
  }, []);

  const handlePaypal = () => {
    Linking.openURL(PAYPAL_LINK);
    Alert.alert(
      "Após pagamento",
      "Envia o comprovativo para o suporte da app ou email para ativar o Premium em minutos."
    );
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
          <Paragraph style={styles.paragraph}>✅ Prioridade no matching</Paragraph>
          <Paragraph style={styles.paragraph}>🎯 Perfil em destaque</Paragraph>
          {isPremium ? (
            <Text style={styles.success}>Já és membro Premium! 🏆</Text>
          ) : (
            <>
              <Button
                mode="contained"
                icon={() => <Entypo name="paypal" size={24} color="#003087" />}
                onPress={handlePaypal}
                style={styles.button}
                labelStyle={{ color: '#003087', fontWeight: 'bold', fontSize: 18 }}
              >
                Comprar com PayPal
              </Button>
              <Text style={styles.info}>
                Vais ser redirecionado para o PayPal. Envia o comprovativo para o suporte da app para ativação imediata.
              </Text>
            </>
          )}
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e8f5e9', padding: 20 },
  center: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#555' },
  card: { borderRadius: 12, elevation: 5, backgroundColor: '#fff', padding: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2e7d32', textAlign: 'center', marginBottom: 15 },
  paragraph: { fontSize: 14, color: '#444', marginBottom: 8 },
  button: { marginTop: 20, backgroundColor: '#ffc439', borderRadius: 28 },
  success: { marginTop: 20, textAlign: 'center', fontWeight: 'bold', color: '#2e7d32' },
  info: { marginTop: 16, fontSize: 15, color: '#555', textAlign: 'center' },
});

