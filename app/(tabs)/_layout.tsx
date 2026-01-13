import BottomNavigation from '@/components/navigations/BottomNavigation';
import { Stack, usePathname } from 'expo-router';
import { View } from 'react-native';

export default function TabsLayout() {
  const pathname = usePathname();
  const currentTab = pathname.split('/')[1] || 'home';

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
          name='home'
          options={{
            title: 'Home',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='kpr-calculator'
          options={{
            title: 'KPR Calculator',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='profile'
          options={{
            title: 'Profil',
            headerShown: false,
          }}
        />
      </Stack>
      <BottomNavigation currentRoute={currentTab} />
    </View>
  );
}
