import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph, Button, Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Equipment {
  id: string;
  name: string;
  description: string;
  price: string; // Preço por hora ou por aluguel
  availability: string; // Exemplo: "Disponível" ou "Indisponível"
}

const EquipmentRentalScreen = () => {
  const router = useRouter();
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          setError('Você precisa estar logado para ver os equipamentos disponíveis.');
          return;
        }

        // Chamar o backend para buscar os equipamentos disponíveis
        const response = await axios.get('http://localhost:5000/api/equipment', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEquipmentList(response.data);
      } catch (error) {
        console.error('Erro ao buscar equipamentos:', error);
        setError('Falha ao carregar os equipamentos. Tente novamente mais tarde.');
        // Dados mockados como fallback
        setEquipmentList([
          {
            id: '1',
            name: 'Raquete de Padel Avançada',
            description: 'Raquete profissional para jogadores avançados.',
            price: '5€/hora',
            availability: 'Disponível',
          },
          {
            id: '2',
            name: 'Kit de Bolas de Padel',
            description: 'Conjunto de 3 bolas de padel de alta qualidade.',
            price: '2€/aluguel',
            availability: 'Indisponível',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  const handleRentEquipment = async (equipmentId: string) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setError('Você precisa estar logado para alugar equipamentos.');
        setSnackbarVisible(true);
        return;
      }

      // Enviar solicitação para alugar o equipamento
      await axios.post(
        `http://localhost:5000/api/equipment/${equipmentId}/rent`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Exibir mensagem de sucesso (você pode redirecionar para uma página de confirmação, se desejar)
      setError('Equipamento alugado com sucesso!');
      setSnackbarVisible(true);
    } catch (error) {
      console.error('Erro ao alugar equipamento:', error);
      setError('Falha ao alugar o equipamento. Tente novamente.');
      setSnackbarVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Aluguer de Material</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1A2B3C" />
            <Text style={styles.loadingText}>Carregando equipamentos...</Text>
          </View>
        ) : (
          <>
            {equipmentList.length === 0 ? (
              <Text style={styles.emptyText}>Nenhum equipamento disponível no momento.</Text>
            ) : (
              equipmentList.map((equipment) => (
                <Card key={equipment.id} style={styles.equipmentCard}>
                  <Card.Content>
                    <View style={styles.equipmentContent}>
                      <Icon name="tennis" size={30} color="#1A2B3C" />
                      <View style={styles.equipmentDetails}>
                        <Title style={styles.equipmentTitle}>{equipment.name}</Title>
                        <Paragraph style={styles.equipmentDescription}>{equipment.description}</Paragraph>
                        <Text style={styles.equipmentInfo}>Preço: {equipment.price}</Text>
                        <Text style={styles.equipmentInfo}>Disponibilidade: {equipment.availability}</Text>
                      </View>
                    </View>
                    <Button
                      mode="contained"
                      style={styles.rentButton}
                      onPress={() => handleRentEquipment(equipment.id)}
                      disabled={equipment.availability !== 'Disponível'}
                    >
                      Alugar Agora
                    </Button>
                  </Card.Content>
                </Card>
              ))
            )}
          </>
        )}

        <View style={styles.bottomNav}>
          <Icon
            name="home"
            size={25}
            color="#888"
            onPress={() => router.push('/')}
          />
          <Icon
            name="account-group"
            size={25}
            color="#888"
            onPress={() => router.push('/community')}
          />
          <Icon
            name="account"
            size={25}
            color="#888"
            onPress={() => router.push('/profile')}
          />
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {error}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#1A2B3C',
    padding: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  equipmentCard: {
    marginHorizontal: 15,
    marginVertical: 10,
    elevation: 4,
    borderRadius: 10,
  },
  equipmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  equipmentDetails: {
    flex: 1,
    marginLeft: 10,
  },
  equipmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  equipmentDescription: {
    fontSize: 12,
    color: '#666',
    marginVertical: 5,
  },
  equipmentInfo: {
    fontSize: 12,
    color: '#888',
  },
  rentButton: {
    marginTop: 10,
    backgroundColor: '#1A2B3C',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  snackbar: {
    backgroundColor: '#D32F2F', // Vermelho para erros
  },
});

export default EquipmentRentalScreen;