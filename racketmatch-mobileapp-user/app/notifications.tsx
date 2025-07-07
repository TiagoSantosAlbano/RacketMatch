import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../config/api';

const NotificationsScreen = () => {
  const router = useRouter();

  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await api.get('/notifications'); 
        setNotifications(response.data || []);
      } catch (err) {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const renderNotification = ({ item }: { item: any }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationMessage}>{item.text || item.message}</Text>
      <Text style={styles.notificationTime}>
        {formatTime(item.createdAt || item.time)}
      </Text>
    </View>
  );

  function formatTime(time: string) {
    if (!time) return '';
    const date = new Date(time);
    return date.toLocaleDateString('pt-PT') + ' ' + date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <View style={styles.container}>
      {/* Header igual ao chat */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/home')}>
          <Icon name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificações</Text>
      </View>

      {/* Tabs iguais ao chat */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabActive}>
          <Text style={styles.tabTextActive}>Notificações</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => router.replace('/chat')}>
          <Text style={styles.tabText}>Conversas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color="#2E4A3D" size="large" />
        ) : notifications.length > 0 ? (
          <FlatList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
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
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E4A3D',
    height: 54,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  backButton: {
    marginRight: 10,
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#2E4A3D',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'center',
  },
  tab: {
    padding: 10,
    marginHorizontal: 8,
  },
  tabActive: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#A8D5BA',
    marginHorizontal: 8,
  },
  tabText: { color: '#fff', fontSize: 16 },
  tabTextActive: { color: '#A8D5BA', fontSize: 16, fontWeight: 'bold' },
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
