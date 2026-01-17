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

    // Check if the first segment is 'auth' group
    const inAuthGroup = segments[0] === 'auth';

    if (isAuthenticated && inAuthGroup) {
      // User is logged in but on login/register pages -> go to Home
      router.replace('/(tabs)');
    } else if (!isAuthenticated && !inAuthGroup) {
      // User is logged out but trying to access protected pages -> go to Login
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
      <Stack.Screen name='(tabs)' />
      <Stack.Screen name='auth/login' />
      <Stack.Screen name='scan-qr' />
      <Stack.Screen name='search/index' />
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
