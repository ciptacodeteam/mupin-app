import { getUserApi, logoutApi } from '@/api/authApi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { getAppVersion, getBuildNumber, getVersionNumber } from '@/lib/version';
import useAuthStore from '@/stores/useAuthStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

const ProfileScreen = () => {
  const [appInfoModalVisible, setAppInfoModalVisible] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data, refetch, isPending, isError, error } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserApi,
    select: (data) => data.results,
    enabled: isAuthenticated,
  });

  const { mutate: logoutMutate, isPending: isLogoutPending } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      logout();
      router.replace('/auth/login');
    },
    onError: () => {
      logout();
      router.replace('/auth/login');
    },
  });

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logoutMutate();
        },
      },
    ]);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isPending) {
    return (
      <View className='items-center justify-center flex-1 bg-white'>
        <ActivityIndicator size='large' color='#3b82f6' />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View className='items-center justify-center flex-1 px-4 bg-white'>
        <Text className='mb-4 text-center text-red-500'>
          {error?.message || 'Failed to load profile'}
        </Text>
        <Button
          onPress={() => refetch()}
          size={'sm'}
          className='px-4 rounded-lg'
        >
          <Text className='text-sm font-semibold'>Retry</Text>
        </Button>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        className='flex-1 bg-white'
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Profile Header */}
        <View className='items-center px-4 py-8 border-b border-gray-200'>
          <Avatar alt='Profile Picture' className='mb-4 w-28 h-28'>
            {data.photo ? (
              <AvatarImage source={{ uri: data.photo }} />
            ) : (
              <AvatarFallback className='bg-blue-500'>
                <Text className='text-3xl font-bold text-white'>
                  {getInitials(data.name)}
                </Text>
              </AvatarFallback>
            )}
          </Avatar>
          <Text className='mb-1 text-xl font-bold text-gray-900'>
            {data.name}
          </Text>
          <Text className='mb-3 text-sm text-gray-500'>@{data.username}</Text>
        </View>

        {/* Account Security Section */}
        <View className='px-4 py-6'>
          <Text className='mb-3 text-xs font-bold tracking-wider text-gray-500 uppercase'>
            Account Security
          </Text>
          <View className='overflow-hidden rounded-lg bg-gray-50'>
            <TouchableOpacity
              className='flex-row items-center justify-between px-4 py-4 border-b border-gray-200'
              onPress={() => router.push('/scan-qr')}
            >
              <View className='flex-row items-center flex-1'>
                <View className='items-center justify-center w-10 h-10 mr-3 bg-blue-100 rounded-lg'>
                  <MaterialCommunityIcons
                    name='scan-helper'
                    size={20}
                    color='#3b82f6'
                  />
                </View>
                <Text className='text-base font-medium text-gray-900'>
                  Scan QR Code
                </Text>
              </View>
              <MaterialCommunityIcons
                name='chevron-right'
                size={24}
                color='#d1d5db'
              />
            </TouchableOpacity>

            <TouchableOpacity
              className='flex-row items-center justify-between px-4 py-4'
              // onPress={() => router.push('/app-settings')}
              disabled
            >
              <View className='flex-row items-center flex-1'>
                <View className='items-center justify-center w-10 h-10 mr-3 bg-blue-100 rounded-lg'>
                  <MaterialCommunityIcons
                    name='cog'
                    size={20}
                    color='#3b82f6'
                  />
                </View>
                <Text className='text-base font-medium text-gray-900'>
                  App Settings
                </Text>
              </View>
              <MaterialCommunityIcons
                name='chevron-right'
                size={24}
                color='#d1d5db'
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Section */}
        <View className='px-4 py-6 border-t border-gray-200'>
          <Text className='mb-3 text-xs font-bold tracking-wider text-gray-500 uppercase'>
            Support
          </Text>
          <View className='overflow-hidden rounded-lg bg-gray-50'>
            <TouchableOpacity
              className='flex-row items-center justify-between px-4 py-4'
              onPress={() => setAppInfoModalVisible(true)}
            >
              <View className='flex-row items-center flex-1'>
                <View className='items-center justify-center w-10 h-10 mr-3 bg-blue-100 rounded-lg'>
                  <MaterialCommunityIcons
                    name='help-circle'
                    size={20}
                    color='#3b82f6'
                  />
                </View>
                <Text className='text-base font-medium text-gray-900'>
                  App Info
                </Text>
              </View>
              <MaterialCommunityIcons
                name='chevron-right'
                size={24}
                color='#d1d5db'
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View className='px-4 py-6 '>
          <Button
            onPress={handleLogout}
            loading={isLogoutPending}
            size={'lg'}
            variant={'secondary'}
            className='flex-row items-center justify-center rounded-lg bg-red-50'
          >
            <MaterialCommunityIcons name='logout' size={20} color='#ef4444' />
            <Text className='ml-2 font-semibold text-red-500'>Logout</Text>
          </Button>
        </View>

        {/* Footer */}
        <View className='px-4 py-4 mt-4'>
          <Text className='text-xs text-center text-gray-400'>
            Version {getAppVersion()}
          </Text>
        </View>
      </ScrollView>

      {/* App Info Modal */}
      <Modal
        visible={appInfoModalVisible}
        animationType='fade'
        transparent={true}
        onRequestClose={() => setAppInfoModalVisible(false)}
      >
        <View className='items-center justify-center flex-1 px-4 bg-black/50'>
          <View className='w-full max-w-sm p-6 bg-white rounded-2xl'>
            {/* Modal Header */}
            <View className='flex-row items-center justify-between mb-6'>
              <Text className='text-xl font-bold text-gray-900'>App Info</Text>
              <TouchableOpacity onPress={() => setAppInfoModalVisible(false)}>
                <MaterialCommunityIcons
                  name='close'
                  size={24}
                  color='#6b7280'
                />
              </TouchableOpacity>
            </View>

            {/* App Details */}
            <View className='gap-4'>
              {/* App Name */}
              <View className='pb-4 border-b border-gray-200'>
                <Text className='mb-1 text-xs font-semibold text-gray-500 uppercase'>
                  App Name
                </Text>
                <Text className='text-lg font-semibold text-gray-900'>
                  {Constants.expoConfig?.name || 'MUPIN'}
                </Text>
              </View>

              {/* Version */}
              <View className='pb-4 border-b border-gray-200'>
                <Text className='mb-1 text-xs font-semibold text-gray-500 uppercase'>
                  Version
                </Text>
                <Text className='text-lg font-semibold text-gray-900'>
                  {getVersionNumber()}
                </Text>
              </View>

              {/* Build Number */}
              <View className='pb-4 border-b border-gray-200'>
                <Text className='mb-1 text-xs font-semibold text-gray-500 uppercase'>
                  Build Number
                </Text>
                <Text className='text-lg font-semibold text-gray-900'>
                  {getBuildNumber()}
                </Text>
              </View>

              {/* Full Version */}
              <View className='pb-4 border-b border-gray-200'>
                <Text className='mb-1 text-xs font-semibold text-gray-500 uppercase'>
                  Full Version
                </Text>
                <Text className='text-lg font-semibold text-gray-900'>
                  {getAppVersion()}
                </Text>
              </View>

              {/* Slug */}
              <View className='pb-4'>
                <Text className='mb-1 text-xs font-semibold text-gray-500 uppercase'>
                  App ID
                </Text>
                <Text className='font-mono text-sm text-gray-600'>
                  {Constants.expoConfig?.slug || 'com.mupin.app'}
                </Text>
              </View>
            </View>

            {/* Close Button */}
            <Button
              onPress={() => setAppInfoModalVisible(false)}
              className='w-full mt-6 bg-blue-500 rounded-lg'
            >
              <Text className='font-semibold text-white'>Close</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
};
export default ProfileScreen;
