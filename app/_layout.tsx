import '@/styles/main.css';
import { PortalHost } from '@rn-primitives/portal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { z } from 'zod';
import { id } from 'zod/locales';

z.config(id());

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name='(tabs)' />
        <Stack.Screen name='auth/login' />
      </Stack>
      <PortalHost />
    </QueryClientProvider>
  );
}
