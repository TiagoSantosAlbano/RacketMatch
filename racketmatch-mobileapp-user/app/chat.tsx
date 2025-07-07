import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';

interface Participant {
  _id: string;
  name: string;
  email?: string;
}

interface Message {
  sender: Participant;
  text: string;
  timestamp: string;
}

interface ChatItem {
  _id: string;
  participants: Participant[];
  messages: Message[];
}

const ChatScreen = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchChats = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get('/chats');
      setChats(res.data.chats || []);
    } catch {
      setChats([]);
    } finally {
      setLoading(false);
    }
  };

 
  useFocusEffect(
    useCallback(() => {
      fetchChats();
    }, [user])
  );


  if (!user) return null;


  const renderChat = ({ item }: { item: ChatItem }) => {

    const other = item.participants.find((p) => p._id !== user._id);

    
    const lastMsg = item.messages.length
      ? item.messages[item.messages.length - 1]
      : null;

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => router.push(`/chat-detail/${item._id}`)}
      >
        <Icon name="account-circle" size={28} color="#20876b" style={{ marginRight: 12 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.chatName}>{other?.name || 'Desconhecido'}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {lastMsg ? `${lastMsg.sender?.name || 'Tu'}: ${lastMsg.text}` : 'Sem mensagens'}
          </Text>
        </View>
        {lastMsg && (
          <Text style={styles.msgTime}>
            {new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Barra superior verde com botão voltar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/home')}>
          <Icon name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Conversas</Text>
      </View>

      {/* Abas de Navegação */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => router.push('/notifications')}
        >
          <Text style={styles.tabText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabActive}>
          <Text style={styles.tabTextActive}>Chats</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color="#20876b" size="large" style={{ marginTop: 30 }} />
        ) : chats.length === 0 ? (
          <>
            <Text style={styles.noChatsText}>Sem conversas ainda</Text>
            <Text style={styles.subText}>As tuas conversas aparecerão aqui</Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => router.push('/start-conversation')}
            >
              <Text style={styles.startButtonText}>Iniciar conversa</Text>
            </TouchableOpacity>
          </>
        ) : (
          <FlatList
            data={chats}
            renderItem={renderChat}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingVertical: 16 }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E4A3D',
    height: 54,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  backButton: {
    marginRight: 10,
    padding: 7,
    borderRadius: 50,
    backgroundColor: '#20876b',
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 2,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#2E4A3D',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tab: {
    padding: 10,
  },
  tabActive: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#A8D5BA',
  },
  tabText: {
    color: '#fff',
    fontSize: 16,
  },
  tabTextActive: {
    color: '#A8D5BA',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  chatName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2E4A3D',
    marginBottom: 2,
  },
  lastMessage: {
    color: '#666',
    fontSize: 14,
  },
  msgTime: {
    color: '#888',
    fontSize: 12,
    marginLeft: 8,
  },
  noChatsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E4A3D',
    marginBottom: 10,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  startButton: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginTop: 10,
  },
  startButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatScreen;
