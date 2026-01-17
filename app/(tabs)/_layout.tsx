import BottomNavigation from '@/components/navigations/BottomNavigation';
import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function TabsLayout() {
  return (
    <View className='flex-1 bg-white'>
      <Stack
        screenOptions={{
          headerShown: false,
          headerTitleAlign: 'center',
          headerTintColor: '#3b82f6',
        }}
      >
        <Stack.Screen
          name='index'
          options={{
            title: 'Home',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='favorites'
          options={{
            title: 'Favorit',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='kpr-simulator'
          options={{
            title: 'KPR Simulator',
            headerShown: true,
            headerBackVisible: false,
            headerTitleAlign: 'left',
            headerTintColor: '#374151',
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name='profile'
          options={{
            title: 'Akun Saya',
            headerShown: true,
            headerBackVisible: false,
            headerTitleAlign: 'left',
            headerTintColor: '#374151',
            headerShadowVisible: false,
          }}
        />
      </Stack>
      <BottomNavigation />
    </View>
  );
}
