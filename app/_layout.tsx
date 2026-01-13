import '@/styles/main.css';
import { Stack } from 'expo-router';
import { z } from 'zod';
import { id } from 'zod/locales';

z.config(id());

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='(tabs)' />
      <Stack.Screen name='auth/login' />
    </Stack>
  );
}
