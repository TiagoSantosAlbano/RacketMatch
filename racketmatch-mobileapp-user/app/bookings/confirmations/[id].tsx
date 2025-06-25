import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';

const BookingConfirmationScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Marcação Confirmada!</Text>
      <Text style={styles.message}>Sua marcação foi confirmada com sucesso.</Text>
      <Text style={styles.message}>ID da Marcação: {id}</Text>
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => router.push('../bookings')}
      >
        Voltar para Minhas Marcações
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A2B3C',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1A2B3C',
  },
});

export default BookingConfirmationScreen;
