import React from 'react';
import { View, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Card, Paragraph, Button, Text, Badge } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

const HomeScreen = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  const isPremium = !!user?.isPremium;
  const userName = user?.name || 'Utilizador';

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00c4b4" />
        <Text style={{ marginTop: 10 }}>Carregando...</Text>
      </View>
    );
  }

  if (!user) {
    setTimeout(() => router.replace('/login'), 100);
    return null;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      <View style={styles.header}>
        <View style={styles.nameRow}>
          <Text style={[styles.greeting, isPremium && styles.premiumName]}>
            Olá, {userName} 👋
          </Text>
          {isPremium && <Icon name="crown" size={20} color="#FFD700" style={{ marginLeft: 8 }} />}
        </View>
        {isPremium && <Badge style={styles.premiumBadge}>Premium</Badge>}
      </View>

      {/* Cartão Premium */}
      <Card style={styles.premiumCard}>
        <Card.Content>
          <View style={styles.premiumContent}>
            <Icon name="crown" size={20} color="#FFD700" />
            <Text style={styles.premiumText}>RacketMatch Premium</Text>
          </View>
          <Paragraph style={styles.premiumDescription}>Descubra as vantagens do Premium</Paragraph>
          {!isPremium ? (
            <Button mode="text" style={styles.premiumButton} onPress={() => router.push('/premium')}>
              {'>'}
            </Button>
          ) : (
            <Text style={styles.activeBadge}>Membro Ativo 🏆</Text>
          )}
        </Card.Content>
      </Card>

      {/* Preferências */}
      <Card style={styles.preferencesCard}>
        <Card.Content style={styles.preferencesContent}>
          <Icon name="cog" size={20} color="#000" />
          <View style={{ flex: 1 }}>
            <Text style={styles.preferencesText}>Editar preferências</Text>
            <Text style={styles.preferencesSubtext}>Mão dominante, lado, tipo de jogo...</Text>
          </View>
          <Button mode="text" style={styles.preferencesButton} onPress={() => router.push('/preferences')}>
            {'>'}
          </Button>
        </Card.Content>
      </Card>

      {/* Secção: Jogo */}
      <Text style={styles.sectionTitle}>Jogue o seu jogo perfeito</Text>
      <View style={styles.matchGrid}>

        <Card style={styles.matchCard}>
          <Card.Content style={styles.matchContent}>
            <View style={styles.rowBetween}>
              <Icon name="magnify" size={30} color="#000" />
              <TouchableOpacity onPress={() => router.push('/bookings/create')}>
                <Icon name="plus-circle" size={28} color="#207c2e" />
              </TouchableOpacity>
            </View>
            <Text style={styles.matchTitle}>Reservar um campo</Text>
            <Text style={styles.matchDescription}>Se já sabe com quem vai jogar</Text>
            <Button mode="contained" style={styles.matchButton} onPress={() => router.push('/bookings')}>
              Reservas
            </Button>
          </Card.Content>
        </Card>

        {/* Jogar um jogo aberto */}
        <Card style={styles.matchCard}>
          <Card.Content style={styles.matchContent}>
            <View style={styles.rowBetween}>
              <Icon name="tennis-ball" size={30} color="#000" />
              <TouchableOpacity onPress={() => router.push('/create-open-match')}>
                <Icon name="plus-circle" size={28} color="#207c2e" />
              </TouchableOpacity>
            </View>
            <Text style={styles.matchTitle}>Jogar um jogo aberto</Text>
            <Text style={styles.matchDescription}>Procure jogadores do seu nível</Text>
            <Button mode="contained" style={styles.matchButton} onPress={() => router.push('/open-match')}>
              Encontrar Jogo
            </Button>
          </Card.Content>
        </Card>
      </View>

      {/* Secção: Clubes */}
      <Text style={styles.sectionTitle}>Os seus clubes</Text>
      <View style={styles.matchGrid}>
        <Card style={styles.clubCard}>
          <Card.Content style={styles.clubContent}>
            <Image
              source={require('@assets/images/squash-olaias.png')}
              style={styles.clubImage}
              resizeMode="cover"
            />
            <Text style={styles.clubName}>Squash Olaias</Text>
            <Text style={styles.clubLocation}>Lisboa</Text>
            <Button mode="contained" style={styles.clubButton} onPress={() => router.push('/club/squash-olaias')}>
              Visitar
            </Button>
          </Card.Content>
        </Card>
        <Card style={styles.clubCard}>
          <Card.Content style={styles.clubContent}>
            <Image
              source={require('@assets/images/lemonfit-padel1.png')}
              style={styles.clubImage}
              resizeMode="cover"
            />
            <Text style={styles.clubName}>Lemonfit Padel</Text>
            <Text style={styles.clubLocation}>Olaias</Text>
            <Button mode="contained" style={styles.clubButton} onPress={() => router.push('/club/lemonfit-padel')}>
              Visitar
            </Button>
          </Card.Content>
        </Card>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Icon name="home" size={25} color="#000" onPress={() => router.push('/home')} />
        <Icon name="chat" size={25} color="#888" onPress={() => router.push('/chat')} />
        <Icon name="account" size={25} color="#888" onPress={() => router.push('/profile')} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#e8f5e9' },
  header: { backgroundColor: '#1A2B3C', padding: 15, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  greeting: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  premiumName: { color: '#FFD700' },
  premiumBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFD700',
    color: '#000',
    fontWeight: 'bold',
    marginTop: 5,
    paddingHorizontal: 8,
  },
  premiumCard: { margin: 15, elevation: 4, borderRadius: 10 },
  premiumContent: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  premiumText: { marginLeft: 10, fontSize: 16, fontWeight: 'bold', color: '#000' },
  premiumDescription: { fontSize: 12, color: '#666' },
  premiumButton: { alignSelf: 'flex-end', marginTop: 5 },
  activeBadge: { marginTop: 10, color: '#28a745', fontWeight: 'bold', textAlign: 'right' },
  preferencesCard: { margin: 15, elevation: 4, borderRadius: 10 },
  preferencesContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  preferencesText: { fontSize: 14, fontWeight: 'bold' },
  preferencesSubtext: { fontSize: 12, color: '#666' },
  preferencesButton: { marginLeft: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', margin: 15, color: '#1A2B3C' },
  matchGrid: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, marginBottom: 15 },
  matchCard: { width: '48%', elevation: 4, borderRadius: 10 },
  matchContent: { alignItems: 'center', padding: 15, width: '100%' },
  matchTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  matchDescription: { fontSize: 12, color: '#666', textAlign: 'center', marginTop: 5 },
  matchButton: { marginTop: 10, backgroundColor: '#1A2B3C' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  clubCard: {
    width: '48%',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 4,
    backgroundColor: '#fff',
  },
  clubContent: {
    padding: 0,
    alignItems: 'center',
  },
  clubImage: {
    width: 200,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
    marginRight: 10,
  },
  clubName: { fontSize: 14, fontWeight: 'bold', marginTop: 10 },
  clubLocation: { fontSize: 12, color: '#666' },
  clubButton: { marginTop: 10, backgroundColor: '#1A2B3C' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', padding: 15, borderTopWidth: 1, borderTopColor: '#eee' },
});

export default HomeScreen;
