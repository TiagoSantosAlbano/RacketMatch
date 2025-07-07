import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, Alert, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import api from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';


let DateTimePicker: any;
let ReactDatePicker: any;
if (Platform.OS !== 'web') {
  // @ts-ignore
  DateTimePicker = require('@react-native-community/datetimepicker').default;
} else {
  ReactDatePicker = require('react-datepicker').default;
  require('react-datepicker/dist/react-datepicker.css');
}

export default function CreateBookingScreen() {
  const [courts, setCourts] = useState<any[]>([]);
  const [court, setCourt] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('authToken');
        const res = await api.get('/courts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourts(res.data);
      } catch (error) {
        Alert.alert('Erro', 'Erro ao procurar campos.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourts();
  }, []);

  const handleBooking = async () => {
    if (!court || !date) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      const isoDate = date.toISOString();
      await api.post('/bookings', { court, date: isoDate }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Sucesso', 'Reserva criada com sucesso!');
      router.replace('/bookings');
    } catch (err) {
      Alert.alert('Erro', 'Erro ao criar reserva.');
    } finally {
      setLoading(false);
    }
  };

  function getDateTimeLabel() {
    if (!date) return 'Escolher data e hora...';
    return date.toLocaleString('pt-PT', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Icon name="arrow-left" size={28} color="#207c2e" />
      </TouchableOpacity>

      <Text style={styles.title}>Nova Reserva</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#20876b" />
      ) : (
        <>
          <Text style={styles.label}>Campo</Text>
          <Picker
            selectedValue={court}
            onValueChange={setCourt}
            style={styles.picker}
          >
            <Picker.Item label="Selecione..." value="" />
            {courts.map((c) => (
              <Picker.Item key={c._id} label={c.name} value={c._id} />
            ))}
          </Picker>
          <Text style={styles.label}>Data/Hora</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: date ? '#222' : '#888', fontSize: 16 }}>
              {getDateTimeLabel()}
            </Text>
            <Icon name="calendar-month" size={22} color="#20876b" />
          </TouchableOpacity>
          {showDatePicker && (
            Platform.OS !== 'web' ? (
              <DateTimePicker
                value={date || new Date()}
                mode="datetime"
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDate(selectedDate);
                }}
                minimumDate={new Date()}
              />
            ) : (
              <div style={{ marginBottom: 20 }}>
                <ReactDatePicker
                  selected={date}
                  onChange={(d: Date) => setDate(d)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="Pp"
                  minDate={new Date()}
                  placeholderText="Escolher data e hora..."
                  className="custom-date-picker"
                  locale="pt"
                />
              </div>
            )
          )}
          <Button title="Reservar" onPress={handleBooking} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f6fafe' },
  backButton: {
    position: 'absolute',
    top: 13,
    left: 13,
    zIndex: 100,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#20876b',
    marginTop: 6,
    alignSelf: 'center',
  },
  label: { fontWeight: 'bold', marginTop: 16, marginBottom: 6 },
  picker: { backgroundColor: '#fff', borderRadius: 10, marginBottom: 14 },
  dateInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#eee',
  },
});
