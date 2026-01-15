import { loginApi } from '@/api/authApi';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import useAuthStore from '@/stores/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Info, Lock, Mail } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput as RNTextInput,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { z } from 'zod';

const formSchema = z.object({
  email: z.email('Format email tidak valid'),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
});

type FormData = z.infer<typeof formSchema>;

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 1000; // 30 seconds

const LoginScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Lockout Logic
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);

  const emailInputRef = useRef<RNTextInput>(null);
  const passwordInputRef = useRef<RNTextInput>(null);

  useEffect(() => {
    if (!lockoutTime) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.ceil((lockoutTime - now) / 1000);

      if (remaining <= 0) {
        setLockoutTime(null);
        setRemainingTime(0);
        setLoginAttempts(0);
        clearInterval(timer);
      } else {
        setRemainingTime(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutTime]);

  const isLockedOut = lockoutTime && lockoutTime > Date.now();

  const handleFailedAttempt = () => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
      const lockoutEnd = Date.now() + LOCKOUT_DURATION;
      setLockoutTime(lockoutEnd);
    }
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const login = useAuthStore((state) => state.login);

  const { mutate, isPending } = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      const token = data.results.token;
      const user = data.results.user;
      login(user, token);
      setLoginAttempts(0);
      reset();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)/home');
    },
    onError: (err) => {
      console.log('Login Error:', err);
      handleFailedAttempt();
      setApiError(
        err?.message ||
          'Gagal masuk. Periksa kembali email dan kata sandi Anda.'
      );
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (isLockedOut) {
      setApiError(
        `Terlalu banyak percobaan. Coba lagi dalam ${remainingTime} detik.`
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    setApiError(null);
    mutate(data);
  };

  return (
    <View className='flex-1 bg-white'>
      {/* Header Background */}
      <View className='absolute top-0 left-0 right-0 h-[35%] bg-blue-600 rounded-b-[40px]' />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
        >
          <View
            className='flex-1 px-6'
            style={{
              paddingTop: insets.top + 20,
              paddingBottom: insets.bottom + 20,
            }}
          >
            {/* Logo & Header */}
            <View className='items-center mb-10'>
              <View className='items-center justify-center w-24 h-24 mb-4 bg-white/20 rounded-3xl backdrop-blur-md'>
                <Image
                  source={require('@/assets/images/brand/logo-white.png')}
                  style={{ width: 60, height: 60 }}
                  contentFit='contain'
                />
              </View>
              <Text className='text-3xl font-bold text-white'>
                Selamat Datang
              </Text>
              <Text className='text-blue-100'>Masuk untuk melanjutkan</Text>
            </View>

            {/* Login Card */}
            <View className='p-6 bg-white shadow-xl shadow-blue-900/10 rounded-3xl'>
              {/* API Error Alert */}
              {apiError && (
                <View className='p-4 mb-6 border border-red-100 rounded-xl bg-red-50'>
                  <View className='flex-row items-center'>
                    <Text className='flex-1 text-sm font-medium text-red-600'>
                      {apiError}
                    </Text>
                  </View>
                </View>
              )}

              <View className='gap-y-5'>
                {/* Email Field */}
                <Controller
                  control={control}
                  name='email'
                  render={({ field: { value, onChange } }) => (
                    <View>
                      <Label className='mb-2 text-neutral-600'>Email</Label>
                      <View
                        className={`flex-row items-center h-14 px-4 border rounded-xl bg-neutral-50 ${errors.email ? 'border-red-500 bg-red-50' : 'border-neutral-200 focus:border-blue-500'}`}
                      >
                        <Mail
                          size={20}
                          color={errors.email ? '#ef4444' : '#64748b'}
                        />
                        <RNTextInput
                          ref={emailInputRef}
                          className='flex-1 ml-3 text-base text-neutral-900'
                          placeholder='nama@email.com'
                          placeholderTextColor='#9ca3af'
                          value={value}
                          onChangeText={onChange}
                          keyboardType='email-address'
                          autoCapitalize='none'
                          autoComplete='email'
                          editable={!isPending && !isLockedOut}
                          returnKeyType='next'
                          onSubmitEditing={() =>
                            passwordInputRef.current?.focus()
                          }
                        />
                      </View>
                      {errors.email && (
                        <Text className='mt-1 text-xs text-red-500'>
                          {errors.email.message}
                        </Text>
                      )}
                    </View>
                  )}
                />

                {/* Password Field */}
                <Controller
                  control={control}
                  name='password'
                  render={({ field: { value, onChange } }) => (
                    <View>
                      <Label className='mb-2 text-neutral-600'>
                        Kata Sandi
                      </Label>
                      <View
                        className={`flex-row items-center h-14 px-4 border rounded-xl bg-neutral-50 ${errors.password ? 'border-red-500 bg-red-50' : 'border-neutral-200'}`}
                      >
                        <Lock
                          size={20}
                          color={errors.password ? '#ef4444' : '#64748b'}
                        />
                        <RNTextInput
                          ref={passwordInputRef}
                          className='flex-1 ml-3 text-base text-neutral-900'
                          placeholder='Masukkan kata sandi'
                          placeholderTextColor='#9ca3af'
                          value={value}
                          onChangeText={onChange}
                          secureTextEntry={!showPassword}
                          editable={!isPending && !isLockedOut}
                          returnKeyType='done'
                          onSubmitEditing={handleSubmit(onSubmit)}
                        />
                        <TouchableOpacity
                          onPress={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff size={20} color='#64748b' />
                          ) : (
                            <Eye size={20} color='#64748b' />
                          )}
                        </TouchableOpacity>
                      </View>
                      {errors.password && (
                        <Text className='mt-1 text-xs text-red-500'>
                          {errors.password.message}
                        </Text>
                      )}
                    </View>
                  )}
                />

                {/* Options */}
                <View className='flex-row items-center justify-between mt-1'>
                  <Pressable
                    onPress={() => setRememberMe(!rememberMe)}
                    className='flex-row items-center gap-2'
                  >
                    <Checkbox
                      checked={rememberMe}
                      onCheckedChange={setRememberMe}
                      className='border-neutral-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600'
                    />
                    <Text className='text-sm text-neutral-600'>Ingat saya</Text>
                  </Pressable>

                  {/* <TouchableOpacity>
                    <Text className='text-sm font-medium text-blue-600'>
                      Lupa kata sandi?
                    </Text>
                  </TouchableOpacity> */}
                </View>

                {/* Submit Button */}
                <Button
                  onPress={handleSubmit(onSubmit)}
                  disabled={isPending || (isLockedOut as boolean)}
                  className='bg-blue-600 h-14 rounded-xl active:bg-blue-700'
                  loading={isPending}
                >
                  <Text className='text-base font-bold text-white'>
                    {isPending ? 'Memproses...' : 'Masuk'}
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer / Internal Use Only */}
      <View
        className='absolute left-0 right-0 items-center'
        style={{ bottom: insets.bottom + 20 }}
      >
        <View className='flex-row items-center px-3 py-1 mb-3 rounded-full bg-neutral-100'>
          <Info size={12} color='#94a3b8' />
          <Text className='ml-1.5 text-[10px] font-medium text-neutral-500 uppercase tracking-wider'>
            Aplikasi Internal Perusahaan
          </Text>
        </View>
        <View className='flex-row'>
          <Text className='text-xs text-neutral-500'>Masalah saat masuk? </Text>
          <TouchableOpacity>
            <Text className='text-xs font-semibold text-blue-600'>
              Hubungi Admin TI
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
