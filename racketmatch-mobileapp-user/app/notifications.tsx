import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

const NotificationsScreen = () => {
  const router = useRouter();

  const notifications = [
    { id: '1', message: 'Novo jogo marcado!', time: 'Hoje às 10:30' },
    { id: '2', message: 'Reserva de campo confirmada', time: 'Ontem' },
    { id: '3', message: 'João Silva enviou uma mensagem', time: '2 dias atrás' },
  ];

  const renderNotification = ({ item }: { item: { id: string; message: string; time: string } }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationTime}>{item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabActive}>
          <Text style={styles.tabTextActive}>Notificações</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => router.push('/chat')}
        >
          <Text style={styles.tabText}>Conversas</Text>
        </TouchableOpacity>
      </View>

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
            <Text style={styles.noNotificationsText}>Sem Notificações</Text>
            <Text style={styles.subText}>As notificações aparecerão aqui</Text>
          </View>
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
  notificationList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  notificationMessage: {
    fontSize: 16,
    color: '#2E4A3D',
    flex: 1,
  },
  notificationTime: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noNotificationsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E4A3D',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#666',
  },
});

export default NotificationsScreen;
