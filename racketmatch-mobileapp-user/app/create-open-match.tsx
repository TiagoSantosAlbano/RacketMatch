import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BackButton from '../components/BackButton';

let DateTimePicker: any;
if (Platform.OS !== 'web') {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
}

function DateTimeField({
  mode,
  value,
  onChange,
  label,
  icon,
  required,
  style = {},
}: {
  mode: 'date' | 'time';
  value: Date | null;
  onChange: (d: Date) => void;
  label: string;
  icon: string;
  required?: boolean;
  style?: object;
}) {
  const [show, setShow] = useState(false);

  if (Platform.OS === 'web') {
    if (mode === 'date') {
      return (
        <View style={[styles.input, style]}>
          <Icon name={icon} size={20} color="#2073c8" />
          <input
            type="date"
            style={webInput}
            value={value ? value.toISOString().slice(0, 10) : ''}
            onChange={e => {
              const val = e.target.value;
              if (val) onChange(new Date(val + 'T' + (value ? value.toTimeString().slice(0,8) : '12:00:00')));
            }}
            required={required}
          />
        </View>
      );
    }
    if (mode === 'time') {
      return (
        <View style={[styles.input, style]}>
          <Icon name={icon} size={20} color="#727272" />
          <input
            type="time"
            style={webInput}
            value={value ? value.toTimeString().slice(0, 5) : ''}
            onChange={e => {
              let base = value ? value : new Date();
              const [hh, mm] = e.target.value.split(':');
              base.setHours(Number(hh), Number(mm), 0, 0);
              onChange(new Date(base));
            }}
            required={required}
          />
        </View>
      );
    }
  }

  return (
    <>
      <TouchableOpacity
        style={[styles.input, style]}
        onPress={() => setShow(true)}
      >
        <Icon name={icon} size={20} color={mode === 'date' ? '#2073c8' : '#727272'} />
        <Text style={{ marginLeft: 8, color: value ? '#333' : (mode === 'date' ? '#2073c8' : '#727272') }}>
          {mode === 'date'
            ? value ? value.toISOString().slice(0, 10) : label
            : value
              ? value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
              : label
          }
        </Text>
      </TouchableOpacity>
      {show && DateTimePicker && (
        <DateTimePicker
          value={value || new Date()}
          mode={mode}
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={mode === 'date' ? new Date() : undefined}
          onChange={(_event: any, selected?: Date | undefined) => {
            setShow(false);
            if (selected) onChange(selected);
          }}
        />
      )}
    </>
  );
}

export default function CreateOpenMatchScreen() {
  const router = useRouter();
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [courtName, setCourtName] = useState('');
  const [courtLocation, setCourtLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateMatch = async () => {
    if (!date || !time || !courtName || !courtLocation) {
      Alert.alert('Erro', 'Preenche todos os campos.');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');

      const match_date = date.toISOString().slice(0, 10);
      const match_time = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

      await axios.post(
        'http://localhost:5000/api/matches',
        {
          match_date,
          match_time,
          court_name: courtName,
          court_location: courtLocation,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert('✅ Sucesso', 'Jogo criado com sucesso!');
      router.replace('/open-match');
    } catch (err) {
      console.error('❌ Erro ao criar jogo:', err);
      Alert.alert('Erro', 'Não foi possível criar o jogo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <BackButton />
        <Text style={styles.title}>Criar Jogo Aberto 🎾</Text>

        <DateTimeField
          mode="date"
          value={date}
          onChange={setDate}
          label="Data (YYYY-MM-DD)"
          icon="calendar"
          required
          style={date ? styles.input : styles.inputActive}
        />
        <DateTimeField
          mode="time"
          value={time}
          onChange={setTime}
          label="Hora (HH:MM)"
          icon="clock-outline"
          required
        />

        <View style={styles.input}>
          <Icon name="stadium" size={20} color="#a44" />
          <TextInput
            style={styles.inputField}
            placeholder="Nome do Campo"
            placeholderTextColor="#888"
            value={courtName}
            onChangeText={setCourtName}
          />
        </View>
        <View style={styles.input}>
          <Icon name="map-marker" size={20} color="#e34" />
          <TextInput
            style={styles.inputField}
            placeholder="Localização"
            placeholderTextColor="#888"
            value={courtLocation}
            onChangeText={setCourtLocation}
          />
        </View>

        <Button
          mode="contained"
          style={styles.button}
          onPress={handleCreateMatch}
          loading={loading}
          disabled={loading}
        >
          Criar Jogo
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6fafe' },
  inner: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1b5e20', marginBottom: 20 },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 14,
    fontSize: 16,
    borderRadius: 10,
    marginBottom: 15,
  },
  inputActive: {
    borderWidth: 2,
    borderColor: '#faa200',
    backgroundColor: '#fffbe9',
  },
  inputField: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  button: {
    marginTop: 10,
    paddingVertical: 12,
    backgroundColor: '#1b5e20',
    borderRadius: 8,
  },
});

const webInput: React.CSSProperties = {
  flex: 1,
  marginLeft: 8,
  padding: 10,
  fontSize: 16,
  borderRadius: 6,
  border: '1px solid #ddd',
  outline: 'none',
  background: '#fff',
};
