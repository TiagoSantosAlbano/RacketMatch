import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Button, RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BackButton from '../components/BackButton';

export default function PreferencesScreen() {
  const [dominantHand, setDominantHand] = useState<string>('right');
  const [preferredSide, setPreferredSide] = useState<string>('any');
  const [playStyle, setPlayStyle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Podes carregar preferências salvas aqui se tiveres endpoint
  }, []);

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return Alert.alert('Erro', 'Sessão expirada.');

      setLoading(true);

      await axios.put(
        'http://31.97.177.93:5000/api/preferences',
        {
          dominant_hand: dominantHand,
          preferred_side: preferredSide,
          play_style: playStyle,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert('✅ Preferências guardadas com sucesso!');
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível guardar as preferências.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BackButton />
        <Text style={styles.title}>Preferências do Jogador 🎾</Text>

        <Text style={styles.label}>Mão dominante</Text>
        <RadioButton.Group
          onValueChange={(newValue) => setDominantHand(newValue)}
          value={dominantHand}
        >
          <View style={styles.radioRow}>
            <RadioButton value="right" />
            <Text style={styles.radioLabel}>Direita</Text>
          </View>
          <View style={styles.radioRow}>
            <RadioButton value="left" />
            <Text style={styles.radioLabel}>Esquerda</Text>
          </View>
        </RadioButton.Group>

        <Text style={styles.label}>Lado preferido da quadra</Text>
        <RadioButton.Group
          onValueChange={(newValue) => setPreferredSide(newValue)}
          value={preferredSide}
        >
          <View style={styles.radioRow}>
            <RadioButton value="left" />
            <Text style={styles.radioLabel}>Esquerdo</Text>
          </View>
          <View style={styles.radioRow}>
            <RadioButton value="right" />
            <Text style={styles.radioLabel}>Direito</Text>
          </View>
          <View style={styles.radioRow}>
            <RadioButton value="any" />
            <Text style={styles.radioLabel}>Tanto faz</Text>
          </View>
        </RadioButton.Group>

        <Text style={styles.label}>Estilo de jogo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: agressivo, defensivo, técnico..."
          value={playStyle}
          onChangeText={setPlayStyle}
        />

        <Button
          mode="contained"
          style={styles.saveButton}
          onPress={handleSave}
          loading={loading}
          disabled={loading}
        >
          Guardar Preferências
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  radioLabel: {
    fontSize: 16,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#2e7d32',
    paddingVertical: 10,
  },
});
