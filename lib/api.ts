import { getAdminApiBaseUrl, getApiBaseUrl } from '@/config/api';
import useAuthStore from '@/stores/useAuthStore';
import axios, { AxiosInstance } from 'axios';

const baseURL = getApiBaseUrl();
const adminBaseURL = getAdminApiBaseUrl();

if (!baseURL || !adminBaseURL) {
  console.warn(
    `⚠️ Perhatian: API Base URL tidak dikonfigurasi. ` +
      `Pastikan EXPO_PUBLIC_API_BASE_URL dan EXPO_PUBLIC_ADMIN_API_BASE_URL diatur di file .env`,
  );
}

// Standard API (Public Data)
export const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Admin/Auth API (Authentication required)
export const adminApi = axios.create({
  baseURL: adminBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const setupInterceptors = (
  instance: AxiosInstance,
  isAuthApi: boolean = false,
) => {
  instance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (isAuthApi) {
      console.log(
        '🔐 [AdminAPI] Token dalam request:',
        token ? '✅ Ada' : '❌ Tidak ada',
      );
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (isAuthApi) {
      // Only warn for Auth API if token is missing (except login)
      // console.warn('⚠️ Token tidak ditemukan di auth store');
    }
    console.log(`📍 [${isAuthApi ? 'AdminAPI' : 'API'}] Endpoint:`, config.url);
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { response } = error;

      // Only logout on 401 Unauthorized (invalid/expired token)
      if (response?.status === 401) {
        console.log('⚠️ Unauthorized - logging out');
        useAuthStore.getState().logout();
      }

      let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';

      if (error?.code === 'ECONNABORTED') {
        errorMessage = 'Koneksi timeout. Pastikan server API dapat diakses.';
      } else if (
        error?.code === 'ENOTFOUND' ||
        error?.code === 'ECONNREFUSED'
      ) {
        errorMessage =
          'Tidak dapat terhubung ke server. Periksa konfigurasi API.';
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      error.message = errorMessage;
      return Promise.reject(error.response?.data || error); // Return full data or error obj
    },
  );
};

setupInterceptors(api, false);
setupInterceptors(adminApi, true);
