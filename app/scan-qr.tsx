import { qrLoginScanApi } from '@/api/authApi';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

const ScanQRScreen = () => {
  const [scanned, setScanned] = useState(false);
  const isFocused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();

  const { mutate: scanQRCode, isPending } = useMutation({
    mutationFn: qrLoginScanApi,
    onSuccess: (data) => {
      console.log('✅ QR Login API Response:', data);
      Alert.alert(
        'QR Login Successful!',
        data.message || 'QR code verified successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              router.back();
            },
          },
        ],
        { cancelable: false }
      );
    },
    onError: (error: any) => {
      console.error('❌ QR Login API Error:', error);
      setScanned(false);

      Alert.alert(
        'QR Login Failed',
        error.response?.data?.message ||
          error.message ||
          'Failed to verify QR code',
        [
          {
            text: 'Try Again',
            onPress: () => {
              setScanned(false);
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              router.back();
            },
          },
        ]
      );
    },
  });

  useEffect(() => {
    const initializeCamera = async () => {
      if (!permission) {
        await requestPermission();
      }
    };

    initializeCamera();
  }, [permission, requestPermission]);

  const handleBarCodeScanned = (result: any) => {
    if (scanned || isPending) return;

    try {
      const qrValue = result.data;
      console.log('📱 QR Code Scanned:', qrValue);

      setScanned(true);
      scanQRCode(qrValue);
    } catch (error) {
      console.error('Error processing QR code:', error);
    }
  };

  if (!permission) {
    return (
      <View className='items-center justify-center flex-1 bg-gray-900'>
        <Text className='mb-4 text-white'>Initializing camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className='items-center justify-center flex-1 px-6 bg-white'>
        <MaterialCommunityIcons
          name='camera-off'
          size={64}
          color='#ef4444'
          style={{ marginBottom: 20 }}
        />
        <Text className='mb-2 text-xl font-bold text-center text-gray-900'>
          Camera Access Denied
        </Text>
        <Text className='mb-8 text-sm text-center text-gray-600'>
          We need camera access to scan QR codes. Please enable it in your
          settings.
        </Text>
        <Button
          onPress={requestPermission}
          className='w-full py-3 bg-blue-500 rounded-lg'
        >
          <Text className='font-semibold text-white'>Grant Permission</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-gray-900'>
      {isFocused && (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing='back'
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        />
      )}

      {/* Header */}
      <View className='absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between px-4 py-4 bg-black/30'>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name='arrow-left' size={28} color='white' />
        </TouchableOpacity>
        <Text className='text-lg font-bold text-white'>Scan QR Code</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Scan Frame */}
      <View className='absolute inset-0 items-center justify-center pointer-events-none'>
        <View
          className='w-64 h-64 border-4 border-blue-500 rounded-2xl'
          style={{
            shadowColor: '#3b82f6',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 20,
          }}
        />
      </View>

      {/* Instructions */}
      <View className='absolute bottom-0 left-0 right-0 px-4 py-6 bg-black/50'>
        <Text className='mb-2 text-base text-center text-white'>
          Position QR code inside the frame
        </Text>
        <Text className='text-sm text-center text-gray-300'>
          Make sure there is sufficient lighting for better accuracy
        </Text>

        {scanned && (
          <Button
            onPress={() => setScanned(false)}
            className='w-full py-3 mt-6 bg-blue-500 rounded-lg'
          >
            <Text className='font-semibold text-white'>Scan Again</Text>
          </Button>
        )}
      </View>

      {/* Loading Indicator */}
      {isPending && (
        <View className='absolute inset-0 items-center justify-center bg-black/40'>
          <View className='px-6 py-4 bg-white rounded-lg'>
            <Text className='font-semibold text-gray-900'>
              Verifying QR code...
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default ScanQRScreen;
