import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

const NotificationsScreen = () => {
  const router = useRouter();

  // Dados fictícios para notificações (pode ser substituído por dados do backend)
  const notifications = [
    { id: '1', message: 'New match scheduled!', time: '10:30 AM' },
    { id: '2', message: 'Court booking confirmed', time: 'Yesterday' },
    { id: '3', message: 'John Doe sent you a message', time: '2 days ago' },
  ];

  // Componente para renderizar cada notificação
  const renderNotification = ({ item }: { item: { id: string; message: string; time: string } }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationTime}>{item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Abas de Navegação */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabActive}>
          <Text style={styles.tabTextActive}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => router.push('/chat')}
        >
          <Text style={styles.tabText}>Chats</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        {notifications.length > 0 ? (
          <FlatList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={(item) => item.id}
            style={styles.notificationList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.noNotificationsText}>No Notifications</Text>
            <Text style={styles.subText}>Notifications will appear here</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA', // Fundo cinza claro
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
    padding: 20,
  },
  notificationList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notificationMessage: {
    fontSize: 16,
    color: '#2E4A3D', // Verde escuro suave para o texto da notificação
    flex: 1,
  },
  notificationTime: {
    fontSize: 14,
    color: '#666', // Cinza para o texto de horário
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noNotificationsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E4A3D', // Verde escuro suave para o texto "No Notifications"
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#666', // Texto cinza
  },
});

export default NotificationsScreen;