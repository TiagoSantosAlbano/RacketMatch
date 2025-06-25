// middleware/withAdminAuth.ts
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAdminAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('adminToken');

      if (!token) {
        router.push('/admin-login' ); // ou rota de login que usas
      }
    };

    checkToken();
  }, []);
};
