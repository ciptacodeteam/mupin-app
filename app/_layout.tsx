import useAuthStore from '@/stores/useAuthStore';
import '@/styles/main.css';
import { PortalHost } from '@rn-primitives/portal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';

import {
  Stack,
  useRootNavigationState,
  useRouter,
  useSegments,
} from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const { isAuthenticated, isHydrated } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!isHydrated || !navigationState?.key) return;

    const inAuthGroup = segments[0] === 'auth';

    if (isAuthenticated && inAuthGroup) {
      // If user is signed in and tries to access auth routes, redirect to home
      router.replace('/(tabs)/home');
    } else if (!isAuthenticated && !inAuthGroup) {
      // If user is not signed in and tries to access protected routes, redirect to login
      router.replace('/auth/login');
    }

    SplashScreen.hideAsync();
  }, [isAuthenticated, isHydrated, segments, navigationState?.key, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <Stack.Screen name='(tabs)' />
      ) : (
        <Stack.Screen name='auth/login' />
      )}
      <Stack.Screen name='scan-qr' />
      <Stack.Screen name='search' />
      <Stack.Screen name='property/[id]' />
      <Stack.Screen name='index' />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <RootLayoutContent />
        </SafeAreaProvider>
      </QueryClientProvider>
      <PortalHost />
    </>
  );
}
