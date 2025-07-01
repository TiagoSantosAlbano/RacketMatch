import { Stack, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-paper';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Página não encontrada' }} />
      <View style={styles.container}>
        {/* <Image
          source={require('../assets/images/not-found.png')}
          style={styles.image}
          resizeMode="contain"
        /> */}

        <Text style={styles.title}>Oops! Esta página não existe 😕</Text>
        <Text style={styles.description}>
          A página que estás a tentar aceder não foi encontrada.
        </Text>

        <Button
          mode="contained"
          style={styles.button}
          onPress={() => router.replace('/home')}
        >
          Ir para o Início 🏠
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1b5e20',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
