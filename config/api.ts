import { Platform } from 'react-native';

/**
 * Mendeteksi dan mengatur baseURL API berdasarkan platform dan environment
 *
 * Android Emulator: 10.0.2.2 (special alias untuk host machine)
 * iOS Simulator: localhost (jika di Mac yang sama)
 * Physical Device: perlu diatur manual di .env dengan IP address
 */
export function getApiBaseUrl(): string {
  const appEnv = process.env.EXPO_PUBLIC_APP_ENV || 'development';

  if (appEnv === 'production') {
    return (
      process.env.EXPO_PUBLIC_PROD_API_BASE_URL || 'http://localhost:80/v1'
    );
  }

  // Development environment
  const baseUrl =
    process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:80/v1';

  // Jika sudah menggunakan IP address (tidak localhost), gunakan langsung
  if (baseUrl.includes('192.168') || baseUrl.includes('10.0.2.2')) {
    return baseUrl;
  }

  // Jika localhost, coba deteksi platform
  if (baseUrl.includes('localhost')) {
    if (Platform.OS === 'android') {
      // Android emulator: localhost → 10.0.2.2
      return baseUrl.replace('localhost', '10.0.2.2');
    }
    // iOS atau Web: gunakan localhost atau sesuai .env
  }

  return baseUrl;
}
