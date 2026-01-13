import { cn } from '@/lib/utils';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useSegments } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

interface BottomNavItem {
  name: string;
  label: string;
  icon: string;
  activeIcon?: string;
  route: string;
  pathSegment: string;
}

interface BottomNavigationProps {
  currentRoute?: string;
}

const TAB_ITEMS: BottomNavItem[] = [
  {
    name: 'home',
    label: 'Home',
    icon: 'home-outline',
    activeIcon: 'home',
    route: '/(tabs)/home',
    pathSegment: 'home',
  },
  {
    name: 'favorites',
    label: 'Favorit',
    icon: 'cards-heart-outline',
    activeIcon: 'cards-heart',
    route: '/(tabs)/favorites',
    pathSegment: 'favorites',
  },
  {
    name: 'kpr',
    label: 'KPR Kalkulator',
    icon: 'calculator-variant-outline',
    activeIcon: 'calculator-variant',
    route: '/(tabs)/kpr-calculator',
    pathSegment: 'kpr-calculator',
  },
  {
    name: 'profile',
    label: 'Akun Saya',
    icon: 'account-outline',
    activeIcon: 'account',
    route: '/(tabs)/profile',
    pathSegment: 'profile',
  },
];

const BottomNavigation = () => {
  const segments = useSegments();
  const activeSegment = segments[segments.length - 1];

  return (
    <View className='pt-1 pb-6 bg-white border-t border-gray-200'>
      <View className='flex-row items-center justify-around h-16'>
        {TAB_ITEMS.map((item) => {
          const isActive = activeSegment === item.pathSegment;
          return (
            <TouchableOpacity
              key={item.name}
              onPress={() => router.push(item.route as any)}
              className='items-center justify-center flex-1 py-2'
            >
              <MaterialCommunityIcons
                name={
                  isActive && item.activeIcon
                    ? (item.activeIcon as any)
                    : (item.icon as any)
                }
                size={24}
                color={isActive ? '#3b82f6' : '#9ca3af'}
              />
              <Text
                className={cn(
                  `text-xs mt-1`,
                  isActive ? 'text-blue-500 font-semibold' : 'text-gray-400'
                )}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
export default BottomNavigation;
