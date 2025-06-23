import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="premium" options={{ headerShown: false }} />
        <Stack.Screen name="preferences" options={{ headerShown: false }} />
        <Stack.Screen name="book-court" options={{ headerShown: false }} />
        <Stack.Screen name="open-match" options={{ headerShown: false }} />
        <Stack.Screen name="equipment-rental" options={{ headerShown: false }} />
        <Stack.Screen name="bookings" options={{ headerShown: false }} /> {/* Certifique-se de que esta linha existe */}
        <Stack.Screen name="bookings/confirmation/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="club/[[...club]]" options={{ headerShown: false }} />
        <Stack.Screen name="community" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="chat" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}