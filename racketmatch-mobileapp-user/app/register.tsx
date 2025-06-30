import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { registerUser } from '../services/authService';

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [preferredLocations, setPreferredLocations] = useState('');
  const [preferredTimes, setPreferredTimes] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !name || !email || !password || !confirmPassword ||
      !skillLevel || !preferredLocations || !preferredTimes
    ) {
      Alert.alert('Erro', 'Preenche todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As passwords não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const response = await registerUser({
      name,
      email,
      password,
      skillLevel: parseInt(skillLevel), // ✅ CORRETO
      preferredLocations: [preferredLocations],
      preferredTimes: [preferredTimes],
      location: {
        type: 'Point',
        coordinates: [-9.14, 38.73],
      },
         tenantId: '665e4429e2530e8c8eb0932b',
      });

      console.log('🟢 Registo bem-sucedido:', response);
      Alert.alert('✅ Sucesso', 'Conta criada com sucesso!');
      router.push('/login');
    } catch (error: any) {
      console.error('❌ Erro ao registar:', error?.response?.data || error);
      Alert.alert('Erro', error?.response?.data?.message || 'Falha no registo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.card}>
        <Text style={styles.logo}>🎾 RacketMatch</Text>
        <Text style={styles.title}>Criar Conta</Text>

        <TextInput
          style={styles.input}
          placeholder="👤 Nome"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="📧 Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="📊 Nível (1 a 5)"
          value={skillLevel}
          onChangeText={setSkillLevel}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="📍 Local preferido"
          value={preferredLocations}
          onChangeText={setPreferredLocations}
        />
        <TextInput
          style={styles.input}
          placeholder="🕐 Horário preferido"
          value={preferredTimes}
          onChangeText={setPreferredTimes}
        />
        <TextInput
          style={styles.input}
          placeholder="🔒 Palavra-passe"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="🔒 Confirmar palavra-passe"
          secureTextEntry={!showPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
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

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? <ActivityIndicator color="#fff" /> : '✍️ Criar Conta'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.registerText}>
            Já tens conta? <Text style={styles.registerLink}>Inicia sessão</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6fafe',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
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
