import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';

const ChatScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Abas de Navegação */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => router.push({pathname: '/notifications'})}
        >
          <Text style={styles.tabText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabActive}>
          <Text style={styles.tabTextActive}>Chats</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        <Image
          source={{ uri: 'https://via.placeholder.com/200' }} // Placeholder para a ilustração
          style={styles.illustration}
        />
        <Text style={styles.noChatsText}>No Chats</Text>
        <Text style={styles.subText}>Chat list will appear here</Text>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push({pathname: '/start-conversation'})}
        >
          <Text style={styles.startButtonText}>Start a conversation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA', // Fundo cinza claro (mantido)
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#2E4A3D', // Verde escuro suave para o fundo das abas
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tab: {
    padding: 10,
  },
  tabActive: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#A8D5BA', // Verde claro para a borda da aba ativa
  },
  tabText: {
    color: '#fff', // Texto branco
    fontSize: 16,
  },
  tabTextActive: {
    color: '#A8D5BA', // Verde claro para o texto da aba ativa
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
    marginBottom: 20,
  },
  noChatsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E4A3D', // Verde escuro suave para o texto "No Chats"
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#666', // Texto cinza (mantido)
    marginBottom: 20,
  },
  startButton: {
    borderWidth: 2,
    borderColor: '#4CAF50', // Verde claro vibrante para a borda do botão
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  startButtonText: {
    color: '#4CAF50', // Verde claro vibrante para o texto do botão
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatScreen;