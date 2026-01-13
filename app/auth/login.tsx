import { loginApi } from '@/api/authApi';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { Text } from '@/components/ui/text';
import useAuthStore from '@/stores/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput as RNTextInput,
  ScrollView,
  View,
} from 'react-native';
import { z } from 'zod';

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof formSchema>;

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 1000; // 30 seconds

const LoginScreen = () => {
  // Handle lockout timer
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);
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

  // Auto focus email on mount
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const isLockedOut = lockoutTime && lockoutTime > Date.now();

  const handleFailedAttempt = () => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);

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
      // Handle success
      const token = data.results.token;
      const user = data.results.user;
      login(user, token);
      setLoginAttempts(0);
      reset();
      router.replace('/(tabs)/home');
    },
    onError: (err) => {
      console.log('🚀 ~ err:', err);
      handleFailedAttempt();
      setApiError(
        err?.message || 'Terjadi kesalahan saat masuk. Silakan coba lagi.'
      );
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log('🚀 ~ onSubmit ~ data:', data);

    if (isLockedOut) {
      setApiError(
        `Terlalu banyak percobaan. Coba lagi dalam ${remainingTime} detik.`
      );
      return;
    }

    mutate(data);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className='flex-1 px-6 bg-background'
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
      >
        <View className='justify-center flex-1 py-8'>
          <Card className='w-full border-0'>
            <CardHeader className='px-0 text-left'>
              <CardTitle className='text-xl'>Selamat Datang</CardTitle>
              <CardDescription>
                Masuk ke akun Anda untuk melanjutkan
              </CardDescription>
            </CardHeader>

            <CardContent className='gap-4 px-0 border-none outline-none'>
              {/* API Error */}
              {apiError && (
                <View className='p-4 border rounded-lg bg-destructive/10 border-destructive/20'>
                  <Text className='text-sm leading-relaxed text-destructive'>
                    {apiError}
                  </Text>
                </View>
              )}

              {/* Form */}
              <View className='gap-4'>
                <Controller
                  control={control}
                  name='email'
                  render={({ field: { value, onChange } }) => (
                    <View className='gap-1.5'>
                      <Label nativeID='email'>Alamat Email</Label>
                      <Input
                        ref={emailInputRef}
                        placeholder='Masukkan email Anda'
                        value={value}
                        onChangeText={onChange}
                        keyboardType='email-address'
                        editable={!isPending && !isLockedOut}
                        autoCapitalize='none'
                        autoComplete='email'
                        returnKeyType='next'
                        onSubmitEditing={() =>
                          passwordInputRef.current?.focus()
                        }
                        aria-labelledby='email'
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && (
                        <Text className='text-sm text-destructive'>
                          {errors.email.message}
                        </Text>
                      )}
                    </View>
                  )}
                />

                <Controller
                  control={control}
                  name='password'
                  render={({ field: { value, onChange } }) => (
                    <View className='gap-1.5'>
                      <Label nativeID='password'>Kata Sandi</Label>
                      <PasswordInput
                        ref={passwordInputRef}
                        placeholder='Masukkan kata sandi Anda'
                        value={value}
                        onChangeText={onChange}
                        editable={!isPending && !isLockedOut}
                        onSubmitEditing={handleSubmit(onSubmit)}
                        aria-invalid={!!errors.password}
                      />
                      {errors.password && (
                        <Text className='text-sm text-destructive'>
                          {errors.password.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
              </View>

              {/* Remember Me */}
              <Pressable
                onPress={() => setRememberMe(!rememberMe)}
                className='flex-row items-center gap-2 mb-4'
              >
                <Checkbox
                  checked={rememberMe}
                  onCheckedChange={setRememberMe}
                />
                <Label
                  onPress={() => setRememberMe(!rememberMe)}
                  disabled={isPending || (isLockedOut as boolean)}
                  className='font-normal'
                >
                  Ingat saya
                </Label>
              </Pressable>

              {/* Submit Button */}
              <Button
                onPress={handleSubmit(onSubmit)}
                disabled={isPending || (isLockedOut as boolean)}
                className='w-full'
                loading={isPending}
              >
                <Text>Masuk</Text>
              </Button>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default LoginScreen;
