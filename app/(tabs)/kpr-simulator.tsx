import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { cn, formatCurrency } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Haptics from 'expo-haptics';
import { Banknote, Calendar, Info, Percent } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

// Validation Schema
const kprFormSchema = z.object({
  hargaProperty: z
    .number()
    .min(1, 'Harga properti harus lebih dari 0')
    .positive('Harga properti harus positif'),
  uangMuka: z
    .number()
    .min(0, 'Uang muka tidak boleh negatif')
    .nonnegative('Uang muka tidak boleh negatif'),
  jangkaCicilan: z
    .number()
    .min(1, 'Jangka waktu minimal 1 tahun')
    .max(30, 'Jangka waktu maksimal 30 tahun')
    .positive('Jangka waktu harus positif'),
  bunga: z
    .number()
    .min(0, 'Bunga tidak boleh negatif')
    .max(20, 'Bunga maksimal 20%')
    .nonnegative('Bunga tidak boleh negatif'),
});

type KPRFormData = z.infer<typeof kprFormSchema>;

interface CalculationResult {
  totalBunga: number;
  cicilanNasabah: number;
  bunga: number;
  plafondCost: number;
}

// Utility function to format number with Indonesian locale (dots for thousands)
const formatNumberDisplay = (value: string | number): string => {
  if (!value) return '';

  // Convert to string and remove non-numeric characters
  const numStr = value.toString().replace(/\D/g, '');

  if (!numStr) return '';

  // Add dots as thousand separators
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Utility function to parse formatted number back to numeric value
const parseFormattedNumber = (value: string): number => {
  if (!value) return 0;
  const numStr = value.replace(/\D/g, '');
  return parseInt(numStr, 10) || 0;
};

// Component for currency input field with real-time formatting
const CurrencyInputField = ({
  label,
  displayValue,
  onChangeText,
  error,
  icon: Icon,
  disabled = false,
}: {
  label: string;
  displayValue: string;
  onChangeText: (text: string) => void;
  error?: string;
  icon?: any;
  disabled?: boolean;
}) => {
  return (
    <View className='mb-4'>
      <Text className='mb-2 text-sm font-medium text-neutral-700'>{label}</Text>
      <View className='flex-row items-center px-3 bg-white border rounded-xl border-neutral-200'>
        {Icon && <Icon size={20} color='#6b7280' className='mr-2' />}
        <Text className='mr-1 font-medium text-neutral-500'>Rp</Text>
        <Input
          className='flex-1 h-12 px-0 text-base font-semibold border-0'
          placeholder='0'
          value={displayValue}
          onChangeText={onChangeText}
          editable={!disabled}
          keyboardType='number-pad'
        />
      </View>
      {error && <Text className='mt-1 text-xs text-red-500'>{error}</Text>}
    </View>
  );
};

const QuickTenorButton = ({
  years,
  active,
  onPress,
}: {
  years: number;
  active: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={cn(
      'px-4 py-2 mr-2 rounded-full border',
      active ? 'bg-blue-600 border-blue-600' : 'bg-white border-neutral-200'
    )}
  >
    <Text
      className={cn(
        'text-sm font-medium',
        active ? 'text-white' : 'text-neutral-600'
      )}
    >
      {years} Thn
    </Text>
  </TouchableOpacity>
);

// PMT Calculation Function
function calculatePMT(rate: number, nper: number, pv: number) {
  const monthlyRate = rate / 100 / 12;
  const denominator = 1 - Math.pow(1 + monthlyRate, -(nper * 12));
  const payment = pv * (monthlyRate / denominator);
  return -payment;
}

const KPRCalculatorScreen = ({ price }: { price?: number }) => {
  const [calculateResult, setCalculateResult] =
    useState<CalculationResult | null>(null);
  const [uangMukaPercent, setUangMukaPercent] = useState('0');

  // Display values for formatted numbers
  const [hargaPropertyDisplay, setHargaPropertyDisplay] = useState('');
  const [uangMukaDisplay, setUangMukaDisplay] = useState('');
  const [jangkaCicilanDisplay, setJangkaCicilanDisplay] = useState('10');
  const [bungaDisplay, setBungaDisplay] = useState('5');

  const {
    watch,
    setValue,
    formState: { errors },
  } = useForm<KPRFormData>({
    resolver: zodResolver(kprFormSchema),
    defaultValues: {
      hargaProperty: price || 0,
      uangMuka: 0,
      jangkaCicilan: 10,
      bunga: 5,
    },
  });

  const formValues = watch();

  // Real-time calculation
  useEffect(() => {
    const calculate = async () => {
      // Basic validation check before calculating
      if (
        formValues.hargaProperty > 0 &&
        formValues.jangkaCicilan > 0 &&
        formValues.bunga >= 0
      ) {
        const plafondCost = formValues.hargaProperty - formValues.uangMuka;
        if (plafondCost <= 0) {
          setCalculateResult(null);
          return;
        }

        const pmt = calculatePMT(
          formValues.bunga,
          formValues.jangkaCicilan,
          -plafondCost
        );

        const ipmt = formValues.jangkaCicilan * 12 * pmt;
        const totalBunga = ipmt - plafondCost;

        const cicilanNasabah =
          (plafondCost + totalBunga) / (formValues.jangkaCicilan * 12);

        setCalculateResult({
          totalBunga: Math.round(totalBunga),
          cicilanNasabah: Math.round(cicilanNasabah),
          bunga: formValues.bunga,
          plafondCost: plafondCost,
        });
      } else {
        setCalculateResult(null);
      }
    };

    calculate();
  }, [
    formValues.hargaProperty,
    formValues.uangMuka,
    formValues.jangkaCicilan,
    formValues.bunga,
  ]);

  const hargaProperty = watch('hargaProperty');

  // Update property price when passed as prop
  useEffect(() => {
    if (price && price > 0) {
      setValue('hargaProperty', price);
      setHargaPropertyDisplay(formatNumberDisplay(price));
    }
  }, [price, setValue]);

  // Handle harga property change with real-time formatting
  const handleHargaPropertyChange = (text: string) => {
    const formatted = formatNumberDisplay(text);
    setHargaPropertyDisplay(formatted);

    const numValue = parseFormattedNumber(formatted);
    setValue('hargaProperty', numValue);
    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Handle uang muka change and update percentage
  const handleUangMukaChange = (text: string) => {
    const formatted = formatNumberDisplay(text);
    setUangMukaDisplay(formatted);

    const numValue = parseFormattedNumber(formatted);
    setValue('uangMuka', numValue);

    if (hargaProperty > 0) {
      const percent = (numValue / hargaProperty) * 100;
      const roundedPercent = Math.min(100, Math.max(0, percent));
      setUangMukaPercent(roundedPercent.toFixed(0));
    }
    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Handle uang muka percentage change and update value
  const handleUangMukaPercentChange = (percentStr: string) => {
    let percent = parseFloat(percentStr) || 0;

    if (percent > 100) {
      percent = 100;
    }
    if (percent < 0) {
      percent = 0;
    }

    setUangMukaPercent(percent.toString());

    const downPayment = (percent / 100) * hargaProperty;
    const roundedDownPayment = Math.round(downPayment);
    setValue('uangMuka', roundedDownPayment);
    setUangMukaDisplay(formatNumberDisplay(roundedDownPayment));
    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Handle jangka cicilan change
  const handleJangkaCicilanChange = (text: string) => {
    const numStr = text.replace(/\D/g, '');
    setJangkaCicilanDisplay(numStr);
    const numValue = parseInt(numStr, 10) || 0;
    setValue('jangkaCicilan', numValue);
    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Handle bunga change
  const handleBungaChange = (text: string) => {
    setBungaDisplay(text);
    const numValue = parseFloat(text) || 0;
    setValue('bunga', numValue);
    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <ScrollView
      className='flex-1 bg-neutral-50'
      showsVerticalScrollIndicator={false}
    >
      <View className='p-4 pb-12'>
        {/* Summary Board */}
        {calculateResult && (
          <Card className='p-6 mb-6 overflow-hidden bg-blue-600 border-0 rounded-3xl'>
            <View className='flex-row items-center justify-between mb-4'>
              <View>
                <Text className='text-sm font-medium text-blue-100'>
                  Estimasi Cicilan
                </Text>
                <Text className='text-3xl font-bold text-white'>
                  {formatCurrency(
                    calculateResult.cicilanNasabah,
                    'id-ID',
                    'IDR'
                  )}
                </Text>
              </View>
              <View className='items-center justify-center w-12 h-12 bg-white/20 rounded-2xl'>
                <Banknote size={24} color='white' />
              </View>
            </View>
            <Separator className='mb-4 bg-white/20' />
            <View className='flex-row justify-between'>
              <View>
                <Text className='text-xs text-blue-100'>Plafon Kredit</Text>
                <Text className='font-semibold text-white'>
                  {formatCurrency(calculateResult.plafondCost, 'id-ID', 'IDR')}
                </Text>
              </View>
              <View className='items-end'>
                <Text className='text-xs text-blue-100'>Tenor</Text>
                <Text className='font-semibold text-white'>
                  {formValues.jangkaCicilan} Tahun
                </Text>
              </View>
            </View>
          </Card>
        )}

        <View className='gap-y-4'>
          {/* Form Card */}
          <Card className='p-4 py-6 bg-white border-0 shadow-sm gap-y-0 rounded-3xl'>
            {/* Harga Property */}
            <CurrencyInputField
              label='Harga Properti'
              displayValue={hargaPropertyDisplay}
              onChangeText={handleHargaPropertyChange}
              error={errors.hargaProperty?.message}
            />

            <Separator className='mt-2 mb-4' />

            {/* Uang Muka & Percentage */}
            <View className='mb-4'>
              <Text className='mb-2 text-sm font-medium text-neutral-700'>
                Uang Muka (DP)
              </Text>
              <View className='flex-row gap-3'>
                <View className='flex-[2] flex-row items-center border border-neutral-200 rounded-xl px-3 bg-white'>
                  <Text className='mr-1 font-medium text-neutral-500'>Rp</Text>
                  <Input
                    className='flex-1 h-12 px-0 text-base font-semibold border-0'
                    placeholder='0'
                    value={uangMukaDisplay}
                    onChangeText={handleUangMukaChange}
                    editable={hargaProperty > 0}
                    keyboardType='number-pad'
                  />
                </View>
                <View className='flex-row items-center flex-1 border rounded-xl border-neutral-200'>
                  <Input
                    className='flex-1 h-12 px-0 text-base font-bold text-right text-blue-600 border-0 '
                    placeholder='0'
                    value={uangMukaPercent}
                    onChangeText={handleUangMukaPercentChange}
                    editable={hargaProperty > 0}
                    keyboardType='decimal-pad'
                  />
                  <Text className='ml-1 mr-2 font-bold text-blue-600'>%</Text>
                </View>
              </View>
              {errors.uangMuka && (
                <Text className='mt-1 text-xs text-red-500'>
                  {errors.uangMuka.message}
                </Text>
              )}
            </View>

            <Separator className='mt-2 mb-6' />

            {/* Tenor Selection */}
            <View className='mb-6'>
              <Text className='mb-3 text-sm font-medium text-neutral-700'>
                Tenor Pinjaman (Tahun)
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className='flex-row mb-4'
                contentContainerStyle={{ paddingRight: 16 }}
              >
                {[
                  5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80,
                ].map((years) => (
                  <QuickTenorButton
                    key={years}
                    years={years}
                    active={formValues.jangkaCicilan === years}
                    onPress={() => {
                      handleJangkaCicilanChange(years.toString());
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }}
                  />
                ))}
              </ScrollView>
              <View className='flex-row items-center px-3 bg-white border border-neutral-200 rounded-xl'>
                <Calendar size={20} color='#6b7280' className='mr-2' />
                <Input
                  className='flex-1 h-12 px-0 ml-2 text-base font-semibold border-0'
                  placeholder='10'
                  value={jangkaCicilanDisplay}
                  onChangeText={handleJangkaCicilanChange}
                  keyboardType='number-pad'
                />
                <Text className='font-medium text-neutral-500'>Tahun</Text>
              </View>
            </View>

            {/* Bunga Selection */}
            <View className='mb-2'>
              <Text className='mb-2 text-sm font-medium text-neutral-700'>
                Suku Bunga Tahunan
              </Text>
              <View className='flex-row items-center px-3 bg-white border border-neutral-200 rounded-xl'>
                <Percent size={20} color='#6b7280' className='mr-2' />
                <Input
                  className='flex-1 h-12 px-0 ml-2 text-base font-semibold border-0'
                  placeholder='5'
                  value={bungaDisplay}
                  onChangeText={handleBungaChange}
                  keyboardType='decimal-pad'
                />
                <Text className='font-medium text-neutral-500'>% / Tahun</Text>
              </View>
            </View>
          </Card>

          {/* Detailed Breakdown */}
          {calculateResult && (
            <Card className='p-6 bg-white border-0 rounded-3xl'>
              <Text className='mb-4 text-lg font-bold text-neutral-900'>
                Rincian Pinjaman
              </Text>
              <View className='gap-y-4'>
                <View className='flex-row justify-between'>
                  <Text className='text-neutral-500'>Plafon Pinjaman</Text>
                  <Text className='font-semibold'>
                    {formatCurrency(
                      calculateResult.plafondCost,
                      'id-ID',
                      'IDR'
                    )}
                  </Text>
                </View>
                <View className='flex-row justify-between'>
                  <Text className='text-neutral-500'>
                    Total Bunga ({calculateResult.bunga}%)
                  </Text>
                  <Text className='font-semibold'>
                    {formatCurrency(calculateResult.totalBunga, 'id-ID', 'IDR')}
                  </Text>
                </View>

                <Separator className='my-2' />

                <View className='flex-row justify-between'>
                  <Text className='text-base font-bold text-neutral-900'>
                    Total Pembayaran
                  </Text>
                  <Text className='text-base font-bold text-blue-600'>
                    {formatCurrency(
                      calculateResult.plafondCost + calculateResult.totalBunga,
                      'id-ID',
                      'IDR'
                    )}
                  </Text>
                </View>
              </View>
            </Card>
          )}

          {/* Tips Card */}
          <Card className='p-4 border-0 bg-orange-50 rounded-2xl'>
            <View className='flex-row items-start'>
              <View className='items-center justify-center mt-0.5 mr-3 w-8 h-8 bg-orange-100 rounded-lg'>
                <Info size={18} color='#f97316' />
              </View>
              <View className='flex-1'>
                <Text className='mb-1 font-bold text-orange-900'>
                  Info Penting
                </Text>
                <Text className='text-xs leading-relaxed text-orange-800'>
                  Hasil simulasi ini merupakan estimasi. Biaya admin, asuransi,
                  dan biaya provisi belum termasuk dalam hitungan ini.
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
};

export default KPRCalculatorScreen;
