import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { formatCurrency } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
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
  disabled = false,
}: {
  label: string;
  displayValue: string;
  onChangeText: (text: string) => void;
  error?: string;
  disabled?: boolean;
}) => {
  return (
    <View className='mb-4'>
      <Text className='mb-2 text-sm font-medium'>{label}</Text>
      <View className='flex-row items-center px-3 bg-white border rounded-lg border-neutral-200'>
        <Text className='mr-2 text-neutral-600'>Rp.</Text>
        <Input
          className='flex-1 h-12 px-0 border-0'
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

// PMT Calculation Function
function calculatePMT(rate: number, nper: number, pv: number) {
  const monthlyRate = rate / 100 / 12;
  const denominator = 1 - Math.pow(1 + monthlyRate, -(nper * 12));
  const payment = pv * (monthlyRate / denominator);
  return -payment;
}

const KPRCalculatorScreen = ({ price }: { price?: number }) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculateResult, setCalculateResult] =
    useState<CalculationResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [uangMukaPercent, setUangMukaPercent] = useState('0');

  // Display values for formatted numbers
  const [hargaPropertyDisplay, setHargaPropertyDisplay] = useState('');
  const [uangMukaDisplay, setUangMukaDisplay] = useState('');
  const [jangkaCicilanDisplay, setJangkaCicilanDisplay] = useState('10');
  const [bungaDisplay, setBungaDisplay] = useState('5');

  const {
    handleSubmit,
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
    setCalculateResult(null);
    setShowResults(false);
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
    setCalculateResult(null);
    setShowResults(false);
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
    setCalculateResult(null);
    setShowResults(false);
  };

  // Handle jangka cicilan change
  const handleJangkaCicilanChange = (text: string) => {
    const numStr = text.replace(/\D/g, '');
    setJangkaCicilanDisplay(numStr);
    const numValue = parseInt(numStr, 10) || 0;
    setValue('jangkaCicilan', numValue);
    setCalculateResult(null);
    setShowResults(false);
  };

  // Handle bunga change
  const handleBungaChange = (text: string) => {
    setBungaDisplay(text);
    const numValue = parseFloat(text) || 0;
    setValue('bunga', numValue);
    setCalculateResult(null);
    setShowResults(false);
  };

  // Calculate KPR
  const onSubmit = async (data: KPRFormData) => {
    setIsCalculating(true);
    setShowResults(false);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const plafondCost = data.hargaProperty - data.uangMuka;

    const pmt = calculatePMT(data.bunga, data.jangkaCicilan, -plafondCost);

    const ipmt = data.jangkaCicilan * 12 * pmt;
    const totalBunga = ipmt - plafondCost;

    const cicilanNasabah =
      (plafondCost + totalBunga) / (data.jangkaCicilan * 12);

    setCalculateResult({
      totalBunga: Math.round(totalBunga),
      cicilanNasabah: Math.round(cicilanNasabah),
      bunga: data.bunga,
      plafondCost: plafondCost,
    });

    setShowResults(true);
    setIsCalculating(false);
  };

  return (
    <ScrollView
      className='flex-1 bg-white'
      showsVerticalScrollIndicator={false}
    >
      <View className='p-4'>
        {/* Info Alert */}
        <Card className='p-4 mb-4 border-0 border-l-4 border-blue-500 bg-blue-50'>
          <View className='flex-row items-start'>
            <Text className='mr-3 text-lg'>ℹ️</Text>
            <View className='flex-1'>
              <Text className='mb-1 font-medium text-gray-900'>
                Tips Simulasi KPR
              </Text>
              <Text className='text-xs leading-4 text-gray-600'>
                Lengkapi semua data properti untuk mendapatkan estimasi cicilan
                bulanan yang akurat sesuai dengan kondisi pasar terkini
              </Text>
            </View>
          </View>
        </Card>

        {/* Form Card */}
        <Card className='p-4 px-0 mb-6 border-0'>
          <View className='space-y-4'>
            {/* Harga Property */}
            <CurrencyInputField
              label='Harga Properti'
              displayValue={hargaPropertyDisplay}
              onChangeText={handleHargaPropertyChange}
              error={errors.hargaProperty?.message}
            />

            <Separator className='mb-4' />

            {/* Uang Muka & Percentage */}
            <View>
              <Text className='mb-3 text-sm font-medium'>Uang Muka</Text>
              <View className='flex-row'>
                <View className='flex-[2] flex-row items-center border border-neutral-200 rounded-lg px-3 bg-white'>
                  <Text className='mr-2 text-neutral-600'>Rp.</Text>
                  <Input
                    className='flex-1 h-12 px-0 border-0'
                    placeholder='0'
                    value={uangMukaDisplay}
                    onChangeText={handleUangMukaChange}
                    editable={hargaProperty > 0}
                    keyboardType='number-pad'
                  />
                </View>
                <View className='flex-row items-center flex-1 px-3 ml-3 bg-white border rounded-lg border-neutral-200'>
                  <Input
                    className='flex-1 h-12 px-0 text-right border-0'
                    placeholder='0'
                    value={uangMukaPercent}
                    onChangeText={handleUangMukaPercentChange}
                    editable={hargaProperty > 0}
                    keyboardType='decimal-pad'
                  />
                  <Text className='ml-2 text-neutral-600'>%</Text>
                </View>
              </View>
              {errors.uangMuka && (
                <Text className='mt-1 text-xs text-red-500'>
                  {errors.uangMuka.message}
                </Text>
              )}
            </View>

            <Separator className='my-4' />

            {/* Jangka Cicilan & Bunga */}
            <View>
              <Text className='mb-3 text-sm font-medium'>Tenor & Bunga</Text>
              <View className='flex-row'>
                <View className='flex-[2] flex-row items-center border border-neutral-200 rounded-lg px-3 bg-white'>
                  <Input
                    className='flex-1 h-12 px-0 border-0'
                    placeholder='1'
                    value={jangkaCicilanDisplay}
                    onChangeText={handleJangkaCicilanChange}
                    keyboardType='number-pad'
                  />
                  <Text className='ml-2 text-sm text-neutral-600'>Tahun</Text>
                </View>
                <View className='flex-row items-center flex-1 px-3 ml-3 bg-white border rounded-lg border-neutral-200'>
                  <Input
                    className='flex-1 h-12 px-0 text-right border-0'
                    placeholder='0'
                    value={bungaDisplay}
                    onChangeText={handleBungaChange}
                    keyboardType='decimal-pad'
                  />
                  <Text className='ml-2 text-neutral-600'>%</Text>
                </View>
              </View>
              {errors.jangkaCicilan && (
                <Text className='mt-1 text-xs text-red-500'>
                  {errors.jangkaCicilan.message}
                </Text>
              )}
              {errors.bunga && (
                <Text className='mt-1 text-xs text-red-500'>
                  {errors.bunga.message}
                </Text>
              )}
            </View>

            <Separator className='mt-4' />

            {/* Calculate Button */}
            <Button
              onPress={handleSubmit(onSubmit)}
              disabled={isCalculating}
              className='mt-4'
              size='lg'
            >
              {isCalculating ? (
                <ActivityIndicator color='white' size='small' />
              ) : (
                <Text className='font-semibold text-white'>Simulasikan</Text>
              )}
            </Button>
          </View>
        </Card>

        {/* Results Section */}
        {!calculateResult ? (
          <Card className='p-6 mb-6 border-0 bg-blue-50'>
            <View className='items-center'>
              <View className='items-center justify-center w-12 h-12 mb-3 bg-blue-100 rounded-full'>
                <Text className='text-lg'>ℹ️</Text>
              </View>
              <Text className='mb-2 font-semibold text-center text-gray-900'>
                Belum ada hasil simulasi
              </Text>
              <Text className='text-sm text-center text-gray-600'>
                Silakan isi semua field simulasi di atas terlebih dahulu untuk
                melihat hasil perhitungan KPR
              </Text>
            </View>
          </Card>
        ) : (
          <Card className='p-4 mb-6 overflow-hidden bg-white '>
            <Pressable
              onPress={() => setShowResults(!showResults)}
              className='flex-row items-center justify-between'
            >
              <Text className='font-semibold '>Hasil Simulasi</Text>
              {showResults ? (
                <ChevronUp size={24} color='#000' />
              ) : (
                <ChevronDown size={24} color='#000' />
              )}
            </Pressable>

            {showResults && (
              <View>
                <Separator />
                <View className='mt-4 space-y-4'>
                  {/* Monthly Payment */}
                  <View className='flex-row items-center justify-between'>
                    <Text className='text-sm font-medium text-neutral-600'>
                      Angsuran Bulanan
                    </Text>
                    <View className='items-end'>
                      <Text className='text-lg font-bold'>
                        {formatCurrency(
                          calculateResult.cicilanNasabah,
                          'id-ID',
                          'IDR'
                        )}
                      </Text>
                      <Text className='text-xs text-neutral-500'>/ Bulan</Text>
                    </View>
                  </View>

                  <Separator className='my-4' />

                  {/* Loan Details */}
                  <View className='space-y-3'>
                    <View className='flex-row justify-between'>
                      <Text className='text-sm text-neutral-600'>
                        Plafon Kredit
                      </Text>
                      <Text className='font-medium'>
                        {formatCurrency(
                          calculateResult.plafondCost,
                          'id-ID',
                          'IDR'
                        )}
                      </Text>
                    </View>

                    <View className='flex-row justify-between'>
                      <Text className='text-sm text-neutral-600'>
                        Bunga {calculateResult.bunga}% / Tahun
                      </Text>
                      <Text className='font-medium'>
                        {formatCurrency(
                          calculateResult.totalBunga,
                          'id-ID',
                          'IDR'
                        )}
                      </Text>
                    </View>

                    <View className='flex-row justify-between'>
                      <Text className='text-sm text-neutral-600'>
                        Total Pembayaran
                      </Text>
                      <Text className='font-bold text-blue-600'>
                        {formatCurrency(
                          calculateResult.plafondCost +
                            calculateResult.totalBunga,
                          'id-ID',
                          'IDR'
                        )}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </Card>
        )}

        {/* Footer Spacing */}
        <View className='h-8' />
      </View>
    </ScrollView>
  );
};

export default KPRCalculatorScreen;
