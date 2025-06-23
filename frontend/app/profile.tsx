import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BackButton from '../components/BackButton';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedSkill, setEditedSkill] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) return;

        const response = await axios.get('http://localhost:5000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
        setEditedName(response.data.name);
        setEditedSkill(String(response.data.skill_level));
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    router.replace('/login');
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.put('http://localhost:5000/api/user', {
        name: editedName,
        skill_level: Number(editedSkill),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser({ ...user, name: editedName, skill_level: Number(editedSkill) });
      setEditMode(false);
      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      Alert.alert('Erro', 'Falha ao atualizar dados.');
    }
  };

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#1A2B3C" /></View>;
  }

  if (!user) {
    return <View style={styles.centered}><Text style={styles.errorText}>Usuário não encontrado.</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Perfil</Text>

      {editMode ? (
        <>
          <TextInput style={styles.input} value={editedName} onChangeText={setEditedName} placeholder="Nome" />
          <TextInput style={styles.input} value={editedSkill} onChangeText={setEditedSkill} keyboardType="numeric" placeholder="Nível de habilidade" />
          <Button mode="contained" style={styles.saveButton} onPress={handleSave}>
            Salvar
          </Button>
        </>
      ) : (
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Nome: <Text style={[styles.value, user.isPremium && styles.premiumName]}>{user.name}</Text></Text>
          <Text style={styles.label}>Email: <Text style={styles.value}>{user.email}</Text></Text>
          <Text style={styles.label}>Skill Level: <Text style={styles.value}>{user.skill_level}</Text></Text>
          {user.isPremium && (
            <View style={styles.premiumBadge}>
              <Icon name="crown" size={18} color="#FFD700" />
              <Text style={styles.premiumBadgeText}>Premium</Text>
            </View>
          )}
          <Button mode="outlined" style={styles.editButton} onPress={() => setEditMode(true)}>
            Editar
          </Button>
        </View>
      )}

      <Button mode="contained" style={styles.logoutButton} onPress={handleLogout}>
        Logout
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#e8f5e9' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#1A2B3C' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  label: { fontSize: 16, marginTop: 10, fontWeight: '600' },
  value: { fontWeight: '500', color: '#333' },
  premiumName: { color: '#FFD700' },
  editButton: { marginTop: 15, borderColor: '#1A2B3C' },
  saveButton: { backgroundColor: '#1A2B3C', marginVertical: 10 },
  logoutButton: { backgroundColor: '#d32f2f', marginTop: 20 },
  errorText: { color: 'red', textAlign: 'center' },
  infoBlock: { marginTop: 10 },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#fff8e1',
    padding: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  premiumBadgeText: {
    marginLeft: 6,
    fontWeight: 'bold',
    color: '#FFD700',
  },
});
