import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native'; // Alert removido
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Verificar se o usuário já está logado ao carregar a página
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          router.replace('/');
        }
      } catch (err) {
        console.error('Erro ao verificar o token:', err);
      }
    };

    checkLoginStatus();
  }, [router]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      setEmail('');
      setPassword('');
      setError('');

      router.replace('/');
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Racket Match</Text>
      <Text style={styles.subtitle}>Faça login para continuar</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A2B3C',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#00C4CC',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 15,
  },
});

export default LoginScreen;
