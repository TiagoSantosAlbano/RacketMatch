import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth(); // ✅ usa o contexto global de auth

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preenche todos os campos.');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post('http://192.168.1.84:5000/api/users/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      await login(token, user); // ✅ guarda nos estados globais + AsyncStorage

      Alert.alert('Bem-vindo!', `Olá, ${user.name}!`);
      router.replace('/'); // ou /home ou outra página protegida
    } catch (error: any) {
      console.error('Erro no login:', error?.response?.data || error);
      Alert.alert('Erro', error?.response?.data?.message || 'Falha no login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.logo}>🎾 RacketMatch</Text>
        <Text style={styles.title}>Iniciar Sessão</Text>

        <TextInput
          style={styles.input}
          placeholder="📧 Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="🔒 Password"
          placeholderTextColor="#888"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.togglePassword}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text style={styles.togglePasswordText}>
            {showPassword ? '🙈 Esconder' : '👁️ Mostrar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>🔓 Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={styles.registerText}>
            Não tens conta? <Text style={styles.registerLink}>Regista-te</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6fafe',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    elevation: 8,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f97316',
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  togglePassword: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  togglePasswordText: {
    fontSize: 14,
    color: '#00c4b4',
  },
  button: {
    backgroundColor: '#00c4b4',
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerText: {
    marginTop: 16,
    color: '#333',
    fontSize: 14,
    textAlign: 'center',
  },
  registerLink: {
    color: '#00a600',
    fontWeight: 'bold',
  },
});
