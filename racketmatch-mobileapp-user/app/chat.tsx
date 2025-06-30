import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';

const ChatScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
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

      {/* Estado Vazio */}
      <View style={styles.content}>
        <Image
          source={require('../assets/images/empty-chat.png')} // Substitui placeholder externo
          style={styles.illustration}
        />
        <Text style={styles.noChatsText}>Sem conversas ainda</Text>
        <Text style={styles.subText}>As tuas conversas aparecerão aqui</Text>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push('/start-conversation')}
        >
          <Text style={styles.startButtonText}>Iniciar conversa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  illustration: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  noChatsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E4A3D',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  startButton: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  startButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatScreen;
