import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || '');

  const handleSave = () => {
    // Implementa aqui o update via API se quiseres editar nome etc.
    setEditMode(false);
    Alert.alert('Sucesso', 'Dados atualizados!');
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login'); // Força navegação após logout
  };

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarCard}>
        <Icon name="account-circle" size={82} color="#00c4b4" />
        <Text style={styles.avatarName}>{user.name}</Text>
        {user.isPremium && (
          <View style={styles.premiumBadge}>
            <Icon name="crown" size={18} color="#FFD700" />
            <Text style={styles.premiumBadgeText}>Premium</Text>
          </View>
        )}
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Icon name="email" size={20} color="#00c4b4" />
          <Text style={styles.infoText}>{user.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="star" size={20} color="#00c4b4" />
          <Text style={styles.infoText}>Nível: {user.skill_level}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="map-marker" size={20} color="#00c4b4" />
          <Text style={styles.infoText}>Localização: {user.preferredLocations?.join(', ')}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="clock-outline" size={20} color="#00c4b4" />
          <Text style={styles.infoText}>Horários: {user.preferredTimes?.join(', ')}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="tennis" size={20} color="#00c4b4" />
          <Text style={styles.infoText}>Clube: {user.tenantId}</Text>
        </View>
      </View>

      {editMode ? (
        <>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nome"
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.editButton} onPress={() => setEditMode(true)}>
          <Icon name="pencil" size={20} color="#00c4b4" />
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6fafe', padding: 22, alignItems: 'center' },
  avatarCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    marginBottom: 20,
    width: '100%',
    elevation: 4,
  },
  avatarName: { fontSize: 22, fontWeight: 'bold', color: '#222', marginTop: 8 },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
    backgroundColor: '#fff8e1',
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderRadius: 50,
  },
  premiumBadgeText: { color: '#FFD700', fontWeight: 'bold', marginLeft: 6 },
  infoCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
  },
  infoText: { marginLeft: 10, fontSize: 16, color: '#222' },
  input: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
    padding: 11,
    borderRadius: 30,
    marginBottom: 12,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  editButtonText: {
    color: '#00c4b4',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#00c4b4',
    borderRadius: 30,
    padding: 13,
    width: '100%',
    marginBottom: 15,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  logoutButton: {
    backgroundColor: '#d32f2f',
    borderRadius: 30,
    padding: 13,
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
  },
  logoutButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, color: '#222', fontWeight: 'bold' },
});
