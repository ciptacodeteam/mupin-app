import { getApiBaseUrl } from '@/config/api';
import useAuthStore from '@/stores/useAuthStore';
import axios from 'axios';

const baseURL = getApiBaseUrl();

if (!baseURL) {
  console.warn(
    `⚠️ Perhatian: API Base URL tidak dikonfigurasi. ` +
      `Pastikan EXPO_PUBLIC_API_BASE_URL atau EXPO_PUBLIC_PROD_API_BASE_URL diatur di file .env`
  );
}

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  console.log('🔐 Token dalam request:', token ? '✅ Ada' : '❌ Tidak ada');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('✅ Authorization header ditambahkan');
  } else {
    console.warn('⚠️ Token tidak ditemukan di auth store');
  }
  console.log('📍 Endpoint:', config.url);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('🚀 ~ response:', response);
    return response;
  },
  async (error) => {
    const { response } = error;
    console.log('🚀 ~ response:', response);

    // Only logout on 401 Unauthorized (invalid/expired token)
    if (response?.status === 401) {
      console.log('⚠️ Unauthorized - logging out');
      useAuthStore.getState().logout();
    } else if (!response) {
      // Network error - don't logout, just log the error
      console.error('Network Error:', error.message);
    } else if (response.status >= 500) {
      // Server error - don't logout, let the app handle it
      console.error('Server Error:', response.status, response.data);
    }

    return Promise.reject(error);
  }
);

export default api;
