import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'login' | 'verify'>('login');
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await axios.post('http://localhost:5000/api/admin-auth/login', { email, password });
      Alert.alert('Código enviado!', 'Verifica o teu email para o código 2FA.');
      setStep('verify');
    } catch (err: any) {
      console.error('Erro no login:', err);
      Alert.alert('Erro', err.response?.data?.message || 'Credenciais inválidas.');
    }
  };

  const handleVerify = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/admin-auth/verify-2fa', { email, code });
      const token = res.data.token;

      
      await AsyncStorage.setItem('adminToken', token);

      Alert.alert('Sucesso', 'Login feito com sucesso!');
      router.replace('/');
    } catch (err: any) {
      console.error('Erro na verificação 2FA:', err);
      Alert.alert('Erro', err.response?.data?.message || 'Código inválido ou expirado.');
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Painel de Admin</Text>

          {step === 'login' ? (
            <>
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
              />
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />
              <Button mode="contained" onPress={handleLogin}>
                Enviar Código
              </Button>
            </>
          ) : (
            <>
              <TextInput
                label="Código 2FA"
                value={code}
                onChangeText={setCode}
                keyboardType="numeric"
                style={styles.input}
              />
              <Button mode="contained" onPress={handleVerify}>
                Verificar Código
              </Button>
            </>
          )}
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f5f5f5' },
  card: { padding: 10 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { marginBottom: 15 },
});
