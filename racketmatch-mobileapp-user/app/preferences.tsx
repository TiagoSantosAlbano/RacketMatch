// components/BackButton.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BackButton = () => {
  const router = useRouter();

  return (
    <TouchableOpacity style={styles.back} onPress={() => router.back()}>
      <Icon name="arrow-left" size={24} color="#2e7d32" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  back: {
    padding: 12,
    marginTop: 10,
    marginLeft: 10,
    alignSelf: 'flex-start',
  },
});

export default BackButton;
