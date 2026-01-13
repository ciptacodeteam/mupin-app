import { ScrollView, Text } from 'react-native';

const ProfileScreen = () => {
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Profile Screen</Text>
    </ScrollView>
  );
};
export default ProfileScreen;
