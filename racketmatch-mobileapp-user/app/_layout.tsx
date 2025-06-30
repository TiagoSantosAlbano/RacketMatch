import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';

import { AuthProvider } from '../context/AuthContext'; // ✅ Envolve a app com contexto de autenticação

// Impede o splash desaparecer automaticamente até a app estar pronta
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Oculta splash quando o layout está carregado
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        >
          {/* Rotas principais da aplicação */}
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="premium" />
          <Stack.Screen name="preferences" />
          <Stack.Screen name="book-court" />
          <Stack.Screen name="open-match" />
          <Stack.Screen name="equipment-rental" />
          <Stack.Screen name="bookings" />
          <Stack.Screen name="bookings/confirmation/[id]" />
          <Stack.Screen name="club/[[...club]]" />
          <Stack.Screen name="community" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="chat" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="start-conversation" />
          <Stack.Screen name="(modals)/not-found" /> {/* Pode usar layout modal se desejado */}
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
