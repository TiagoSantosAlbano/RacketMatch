import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const BookingConfirmationScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <MaterialIcons name="check-circle" size={72} color="#00C851" style={styles.icon} />
      <Text style={styles.title}>Marcação Confirmada!</Text>
      <Text style={styles.message}>A tua marcação foi registada com sucesso 🎉</Text>
      <Text style={styles.idText}>🆔 ID da Marcação: <Text style={styles.id}>{id}</Text></Text>

      <Button
        mode="contained"
        style={styles.button}
        labelStyle={styles.buttonLabel}
        onPress={() => router.push('./bookings')}
      >
        Ver as minhas marcações
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f9fc',
    padding: 24,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a2b3c',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 12,
  },
  idText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 24,
  },
  id: {
    fontWeight: '600',
    color: '#00C851',
  },
  button: {
    backgroundColor: '#00C851',
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  buttonLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BookingConfirmationScreen;
