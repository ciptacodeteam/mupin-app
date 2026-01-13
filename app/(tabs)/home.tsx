import { router } from 'expo-router';
import { Button, Text, View } from 'react-native';

const HomeScreen = () => {
  return (
    <View className='items-center justify-center flex-1'>
      <Text>Home Screen</Text>
      <Button
        onPress={() => {
          router.push('/auth/login');
        }}
        title='Login'
      />
    </View>
  );
};
export default HomeScreen;
