import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';

export default function ProfileScreen() {
  const { user, logout, login, loading } = useAuth();
  const [editMode, setEditMode] = useState(false);


  const [name, setName] = useState(user?.name || '');
  const [skill, setSkill] = useState(user?.skill_level?.toString() || '');
  const [locations, setLocations] = useState(
    Array.isArray(user?.preferredLocations)
      ? user.preferredLocations.join(', ')
      : (user?.preferredLocations || '')
  );
  const [times, setTimes] = useState(
    Array.isArray(user?.preferredTimes)
      ? user.preferredTimes.join(', ')
      : (user?.preferredTimes || '')
  );
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00c4b4" />
        <Text style={styles.title}>Carregando perfil...</Text>
      </View>
    );
  }

  
  if (!user) {
    setTimeout(() => router.replace('/login'), 100); 
    return null;
  }

  
  const renderLocations = () =>
    Array.isArray(user.preferredLocations)
      ? user.preferredLocations.join(', ')
      : (user.preferredLocations || '');
  const renderTimes = () =>
    Array.isArray(user.preferredTimes)
      ? user.preferredTimes.join(', ')
      : (user.preferredTimes || '');

 
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Erro', 'Sessão expirada. Faz login novamente.');
        await logout();
        router.replace('/login');
        return;
      }
      const payload = {
        name,
        skill_level: Number(skill),
        preferredLocations: locations.split(',').map(l => l.trim()).filter(Boolean),
        preferredTimes: times.split(',').map(t => t.trim()).filter(Boolean),
      };
      const response = await api.put(`/users/${user._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
   
      await login(token, response.data);
      setEditMode(false);
      Alert.alert('Sucesso', 'Dados atualizados!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    } finally {
      setSaving(false);
    }
  };

 
  const handleDelete = async () => {
    if (!user) return;
    Alert.alert(
      'Eliminar conta',
      'Tens a certeza? Esta ação é irreversível.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim, eliminar',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              const token = await AsyncStorage.getItem('authToken');
              if (!token) {
                Alert.alert('Erro', 'Sessão expirada. Faz login novamente.');
                await logout();
                router.replace('/login');
                return;
              }
              await api.delete(`/users/${user._id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              await logout();
              router.replace('/login');
            } catch (e) {
              Alert.alert('Erro', 'Erro ao eliminar a conta.');
            } finally {
              setDeleting(false);
            }
          },
        }
      ]
    );
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      {/* Botão voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/home')}>
        <Icon name="arrow-left" size={26} color="#00c4b4" />
      </TouchableOpacity>

      <View style={styles.avatarCard}>
        <Icon name="account-circle" size={60} color="#00c4b4" />
        <Text style={styles.avatarName}>{user.name}</Text>
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
          <Text style={styles.infoText}>Localização: {renderLocations()}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="clock-outline" size={20} color="#00c4b4" />
          <Text style={styles.infoText}>Horários: {renderTimes()}</Text>
        </View>
      </View>

      {editMode ? (
        <>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nome"
            editable={!saving}
          />
          <TextInput
            style={styles.input}
            value={skill}
            onChangeText={setSkill}
            placeholder="Nível"
            keyboardType="numeric"
            editable={!saving}
          />
          <TextInput
            style={styles.input}
            value={locations}
            onChangeText={setLocations}
            placeholder="Localização (ex: Lisboa, Porto)"
            editable={!saving}
          />
          <TextInput
            style={styles.input}
            value={times}
            onChangeText={setTimes}
            placeholder="Horários (ex: 14, 18, 21)"
            editable={!saving}
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? 'A guardar...' : 'Guardar'}
            </Text>
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
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: '#a30000', marginTop: 8 }]}
        onPress={handleDelete}
        disabled={deleting}
      >
        <Text style={styles.logoutButtonText}>
          {deleting ? 'A eliminar...' : 'Eliminar Conta'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6fafe', padding: 22, alignItems: 'center' },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginLeft: -6,
    marginTop: 4,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
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

