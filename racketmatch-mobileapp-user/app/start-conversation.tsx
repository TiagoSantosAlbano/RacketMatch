import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

export default function StartConversationScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [targetUsername, setTargetUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStartConversation = async () => {
    if (!user) {
      Alert.alert('Erro', 'Tens de estar autenticado para iniciar conversas!');
      return;
    }
    if (!targetUsername.trim()) {
      Alert.alert('Erro', 'Introduz o nome do utilizador com quem queres falar!');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/chats', { targetName: targetUsername.trim() });
      const chatId = res.data.chatId || res.data._id;
      if (!chatId) throw new Error('Não foi possível criar/obter a conversa!');
        router.replace(`/chat-detail/${chatId}`);
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.message || err.message || 'Erro ao criar conversa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Nova Conversa</Text>
      <TextInput
        placeholder="Nome do utilizador destino"
        value={targetUsername}
        onChangeText={setTargetUsername}
        style={styles.input}
        editable={!loading}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleStartConversation}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Iniciar Conversa</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()} style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 32, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 18, textAlign: 'center', color: '#222' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { alignItems: 'center', marginTop: 5 },
  cancelButtonText: { color: '#4CAF50', fontSize: 15 },
});
