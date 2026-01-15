import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams();
  return (
    <View className='flex-1 items-center justify-center bg-white'>
      <Text>Property Detail ID: {id}</Text>
    </View>
  );
}
