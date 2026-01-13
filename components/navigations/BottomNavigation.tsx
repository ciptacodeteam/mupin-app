import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

interface BottomNavItem {
  name: string;
  label: string;
  icon: string;
  route: string;
}

interface BottomNavigationProps {
  currentRoute?: string;
}

const TAB_ITEMS: BottomNavItem[] = [
  {
    name: 'home',
    label: 'Home',
    icon: 'home',
    route: '/(tabs)/home',
  },
  {
    name: 'kpr',
    label: 'KPR',
    icon: 'home',
    route: '/(tabs)/kpr-calculator',
  },
  {
    name: 'profile',
    label: 'Profile',
    icon: 'account',
    route: '/(tabs)/profile',
  },
];

const BottomNavigation = ({ currentRoute }: BottomNavigationProps) => {
  return (
    <View className='bg-white border-t border-gray-200'>
      <View className='flex-row items-center justify-around h-16'>
        {TAB_ITEMS.map((item) => {
          const isActive = currentRoute === item.name;
          return (
            <TouchableOpacity
              key={item.name}
              onPress={() => router.push(item.route as any)}
              className='items-center justify-center flex-1 py-2'
            >
              <MaterialCommunityIcons
                name={item.icon as any}
                size={24}
                color={isActive ? '#3b82f6' : '#9ca3af'}
              />
              <Text
                className={`text-xs mt-1 ${
                  isActive ? 'text-blue-500 font-semibold' : 'text-gray-400'
                }`}
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
