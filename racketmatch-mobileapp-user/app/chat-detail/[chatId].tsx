import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';

export default function ChatDetailScreen() {
  const { chatId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [chat, setChat] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<any>(null);


  useEffect(() => {
    if (!chatId) return;
    const fetchChat = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/chats/${chatId}`);
        setChat(res.data);
      } catch (err) {
        setChat(null);
      } finally {
        setLoading(false);
      }
    };
    fetchChat();
  }, [chatId]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      await api.post(`/chats/${chatId}/message`, { text: message });
      setMessage('');

      const res = await api.get(`/chats/${chatId}`);
      setChat(res.data);

      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f6fafe' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Seta voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/chat')}>
        <Text style={{ color: '#00c4b4', fontSize: 20 }}>⬅ Voltar</Text>
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        {loading ? (
          <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#00c4b4" />
        ) : !chat ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Erro ao carregar chat.</Text>
        ) : (
          <>
            <FlatList
              ref={flatListRef}
              data={chat.messages}
              keyExtractor={(_, idx) => idx.toString()}
              renderItem={({ item }) => (
                <View style={[
                  styles.message,
                  item.sender === user?._id
                    ? styles.messageMine
                    : styles.messageOther,
                ]}>
                  <Text style={styles.sender}>{item.sender?.name || 'Tu'}</Text>
                  <Text>{item.text}</Text>
                  <Text style={styles.timestamp}>
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </Text>
                </View>
              )}
              contentContainerStyle={{ padding: 16 }}
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
            />
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="Mensagem"
                editable={!sending}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={sendMessage}
                disabled={sending}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                  {sending ? '...' : 'Enviar'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginTop: 30,
    marginLeft: 10,
    marginBottom: 2,
  },
  message: {
    backgroundColor: '#eee',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  messageMine: {
    backgroundColor: '#c5f3e8',
    alignSelf: 'flex-end',
  },
  messageOther: {
    backgroundColor: '#e6e6e6',
    alignSelf: 'flex-start',
  },
  sender: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 10,
    color: '#aaa',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    borderRadius: 25,
    padding: 12,
    fontSize: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#00c4b4',
    padding: 12,
    borderRadius: 25,
  },
});
