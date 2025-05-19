import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        router.replace('/guest/login'); // Navigate to login screen if no token
      } else if (token) {
        router.replace('/(tabs)'); // Navigate to tabs screen if token is present
      }
    };

    checkToken();
  }, [router]);

}
