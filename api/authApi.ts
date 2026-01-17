import { adminApi } from '@/lib/api';
import { LoginRequest } from '@/types';

export async function loginApi(payload: LoginRequest): Promise<any> {
  const { data } = await adminApi.post('/auth/login', payload);
  return data;
}

export async function logoutApi() {
  const { data } = await adminApi.post('/auth/logout');
  return data;
}

export async function getUserApi() {
  const { data } = await adminApi.get('/auth/profile');
  return data;
}

export async function changePasswordApi(payload) {
  const { data } = await adminApi.post('/auth/change-password', payload);
  return data;
}

export async function changeProfileApi(payload) {
  const { data } = await adminApi.post('/auth/update-profile', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
}

export async function qrLoginScanApi(qrCode: string) {
  const { data } = await adminApi.post('/auth/qr-login/scan', {
    qr_code: qrCode,
    app_key: process.env.EXPO_PUBLIC_MOBILE_APP_KEY,
  });
  return data;
}
