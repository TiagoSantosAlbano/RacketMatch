import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  View,
  Platform,
} from 'react-native';
import { Button, Card, Paragraph } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../components/BackButton';

interface Court {
  _id: string;
  name: string;
  location: string;
}

export default function BookCourtScreen() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<string | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCourts = async () => {
    try {
      const res = await axios.get('http://31.97.177.93:5000/api/courts');
      setCourts(res.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as campos. Verifique a sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedCourt) {
      return Alert.alert('⚠️ Atenção', 'Por favor, selecione campo.');
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Erro', 'Token de autenticação não encontrado. Faça login novamente.');
        return;
      }

      await axios.post(
        'http://31.97.177.93:5000/api/bookings',
        {
          court: selectedCourt,
          date: date.toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert('✅ Sucesso', 'Reserva efetuada com sucesso!');
      setSelectedCourt(null);
      setDate(new Date());
    } catch (error: any) {
      console.error('Erro na reserva:', error?.response?.data || error);
      Alert.alert('Erro', error?.response?.data?.message || 'Falha ao efetuar a reserva. Tente novamente.');
    }
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  function renderDateTimePicker() {
    if (Platform.OS === 'web') {
      return (
        <input
          type="datetime-local"
          style={{
            width: '100%',
            padding: 10,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#2e7d32',
            marginBottom: 20,
            fontSize: 16,
          }}
          value={date.toISOString().slice(0, 16)}
          min={new Date().toISOString().slice(0, 16)}
          onChange={e => setDate(new Date(e.target.value))}
        />
      );
    }
    return (
      <>
        <Button
          onPress={() => setShowDatePicker(true)}
          mode="outlined"
          style={styles.dateButton}
        >
          {date.toLocaleString()}
        </Button>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display="default"
            minimumDate={new Date()}
            onChange={(_, selectedDate?: Date) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}
      </>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BackButton />
      <Text style={styles.title}>📅 Reservar campo</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#43a047" style={{ marginTop: 20 }} />
      ) : (
        <>
          <Text style={styles.subtitle}>Selecione campo:</Text>
          {courts.length === 0 ? (
            <Text style={styles.noCourtsText}>Nenhcampo disponível no momento.</Text>
          ) : (
            courts.map((court) => (
              <Card
                key={court._id}
                style={[
                  styles.card,
                  selectedCourt === court._id && styles.selectedCard,
                ]}
                onPress={() => setSelectedCourt(court._id)}
              >
                <Card.Content>
                  <Paragraph style={styles.cardText}>{court.name}</Paragraph>
                  <Text style={styles.cardSubtext}>{court.location}</Text>
                </Card.Content>
              </Card>
            ))
          )}

          <View style={styles.separator} />

          <Text style={styles.subtitle}>Escolha a data e hora:</Text>
          {renderDateTimePicker()}

          <Button
            mode="contained"
            style={styles.bookButton}
            onPress={handleBooking}
            disabled={!selectedCourt}
          >
            Confirmar Reserva
          </Button>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#e8f5e9',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#388e3c',
  },
  noCourtsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    backgroundColor: '#ccc',
  },
  card: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#c8e6c9',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  selectedCard: {
    borderColor: '#2e7d32',
    backgroundColor: '#a5d6a7',
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  cardSubtext: {
    fontSize: 12,
    color: '#666',
  },
  dateButton: {
    marginBottom: 20,
    borderColor: '#2e7d32',
  },
  bookButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 10,
    borderRadius: 8,
  },
});
