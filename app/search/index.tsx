import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Option,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { useRouter } from 'expo-router';
import {
  ArrowRight,
  Bath,
  BedDouble,
  Building,
  Building2,
  ChevronLeft,
  Compass,
  FileText,
  Hammer,
  Home,
  Layers,
  Search,
  Store,
  Wallet,
  Zap,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Control, Controller, UseFormSetValue, useForm } from 'react-hook-form';
import {
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SearchOption = Option;

type SearchFormData = {
  transactionType: 'Jual' | 'Sewa';
  propertyType: string;
  priceMin: string;
  priceMax: string;
  beds: number;
  baths: number;
  floors: number;
  landAreaMin: string;
  buildingAreaMin: string;
  certificate: string;
  electricity: string;
  water: string;
  orientation: string;
  condition: string;
};

const PROPERTY_TYPES = [
  { id: 'Rumah', label: 'Rumah', icon: Home },
  { id: 'Apartemen', label: 'Apartemen', icon: Building2 },
  { id: 'Ruko', label: 'Ruko', icon: Store },
  { id: 'Tanah', label: 'Tanah', icon: Layers },
  { id: 'Kantor', label: 'Kantor', icon: Building },
  { id: 'Gudang', label: 'Gudang', icon: Home },
];

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // We can let react-hook-form manage the single source of truth,
  // but Tabs requires a value prop. We'll sync them.
  const [activeTab, setActiveTab] = useState('Jual');

  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({
      ios: insets.bottom,
      android: insets.bottom + 24,
    }),
    left: 12,
    right: 12,
  };

  const { control, handleSubmit, watch, setValue } = useForm<SearchFormData>({
    defaultValues: {
      transactionType: 'Jual',
      propertyType: 'Rumah',
      priceMin: '',
      priceMax: '',
      beds: 0,
      baths: 0,
      floors: 0,
      landAreaMin: '',
      buildingAreaMin: '',
      certificate: '',
      electricity: '',
      water: '',
      orientation: '',
      condition: '',
    },
  });

  const onTabChange = (val: string) => {
    setActiveTab(val);
    setValue('transactionType', val as 'Jual' | 'Sewa');
  };

  const onSearch = (data: SearchFormData) => {
    console.log('Search Data:', data);
    // In a real app, this would filter the query or navigate with params
    router.back();
  };

  return (
    <View className='flex-1 bg-white'>
      {/* Header */}
      <View
        className='z-10 px-4 pb-4 bg-white border-b border-neutral-100'
        style={{ paddingTop: insets.top + 10 }}
      >
        <View className='flex-row items-center gap-3'>
          <TouchableOpacity
            onPress={() => router.back()}
            className='items-center justify-center w-10 h-10 -ml-2 rounded-full'
          >
            <ChevronLeft size={24} color='#1e293b' />
          </TouchableOpacity>
          <View className='flex-row items-center flex-1 h-12 px-4 bg-neutral-100 rounded-xl'>
            <Search size={20} color='#94a3b8' />
            <TextInput
              placeholder='Cari lokasi, area, atau nama property...'
              placeholderTextColor='#9ca3af'
              className='flex-1 ml-3 text-base text-neutral-900'
              autoFocus
            />
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className='p-6 pb-2'>
          <Tabs
            value={activeTab}
            onValueChange={onTabChange}
            className='w-full'
          >
            <TabsList className='w-full h-10 mb-6'>
              {['Jual', 'Sewa'].map((type) => (
                <TabsTrigger key={type} value={type} className='flex-1 '>
                  <Text className='text-base font-semibold'>{type}</Text>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value='Jual'>
              <SearchFormContent
                control={control}
                setValue={setValue}
                watch={watch}
                contentInsets={contentInsets}
              />
            </TabsContent>

            <TabsContent value='Sewa'>
              <SearchFormContent
                control={control}
                setValue={setValue}
                watch={watch}
                contentInsets={contentInsets}
              />
            </TabsContent>
          </Tabs>
        </View>
      </ScrollView>

      {/* Footer */}
      <View
        className='absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-100'
        style={{ paddingBottom: insets.bottom + 20 }}
      >
        <Button
          onPress={handleSubmit(onSearch)}
          className='flex-row items-center justify-center w-full bg-blue-600 h-14 rounded-xl active:bg-blue-700'
        >
          <Text className='mr-2 text-base font-bold text-white'>
            Tampilkan 124+ Properti
          </Text>
          <ArrowRight size={20} color='white' />
        </Button>
      </View>
    </View>
  );
}

// Reusable Form Content Component
const SearchFormContent = ({
  control,
  setValue,
  watch,
  contentInsets,
}: {
  control: Control<SearchFormData>;
  setValue: UseFormSetValue<SearchFormData>;
  watch: any;
  contentInsets: any;
}) => {
  const selectedPropertyType = watch('propertyType');

  const CounterInput = ({
    label,
    value,
    onChange,
    icon: Icon,
  }: {
    label: string;
    value: number;
    onChange: (val: number) => void;
    icon: any;
  }) => (
    <View className='flex-1 p-3 border border-neutral-200 rounded-xl'>
      <View className='flex-row items-center gap-2 mb-2'>
        <Icon size={16} color='#64748b' />
        <Text className='text-xs font-medium text-neutral-500'>{label}</Text>
      </View>
      <View className='flex-row items-center justify-between'>
        <TouchableOpacity
          onPress={() => onChange(Math.max(0, value - 1))}
          className='items-center justify-center w-8 h-8 rounded-full bg-neutral-100'
        >
          <Text className='text-lg font-medium text-neutral-600'>-</Text>
        </TouchableOpacity>
        <Text className='text-lg font-bold text-neutral-900'>{value} +</Text>
        <TouchableOpacity
          onPress={() => onChange(value + 1)}
          className='items-center justify-center w-8 h-8 rounded-full bg-blue-50'
        >
          <Text className='text-lg font-medium text-blue-600'>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View>
      {/* Property Type Grid */}
      <Text className='mb-4 text-sm font-bold text-neutral-900'>
        Tipe Properti
      </Text>
      <View className='flex-row flex-wrap gap-3 mb-8'>
        {PROPERTY_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedPropertyType === type.id;
          return (
            <TouchableOpacity
              key={type.id}
              onPress={() => setValue('propertyType', type.id)}
              className={cn(
                'items-center justify-center w-[30%] h-24 rounded-2xl border-2',
                isSelected
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-transparent bg-neutral-50'
              )}
            >
              <Icon
                size={24}
                color={isSelected ? '#2563eb' : '#64748b'}
                className='mb-2'
              />
              <Text
                className={cn(
                  'text-xs font-medium',
                  isSelected ? 'text-blue-600' : 'text-neutral-600'
                )}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Price Range */}
      <View className='mb-8'>
        <View className='flex-row items-center gap-2 mb-4'>
          <Wallet size={18} color='#1e293b' />
          <Text className='text-sm font-bold text-neutral-900'>
            Rentang Harga
          </Text>
        </View>
        <View className='flex-row gap-4'>
          <Controller
            control={control}
            name='priceMin'
            render={({ field: { onChange, value } }) => (
              <View className='flex-1'>
                <Label className='mb-1.5 text-xs text-neutral-500'>
                  Minimum
                </Label>
                <Input
                  placeholder='0'
                  keyboardType='numeric'
                  className='bg-neutral-50 border-neutral-200'
                  value={value}
                  onChangeText={onChange}
                />
              </View>
            )}
          />
          <Controller
            control={control}
            name='priceMax'
            render={({ field: { onChange, value } }) => (
              <View className='flex-1'>
                <Label className='mb-1.5 text-xs text-neutral-500'>
                  Maksimum
                </Label>
                <Input
                  placeholder='Milyar'
                  keyboardType='numeric'
                  className='bg-neutral-50 border-neutral-200'
                  value={value}
                  onChangeText={onChange}
                />
              </View>
            )}
          />
        </View>
      </View>

      {/* Specifications */}
      <View className='mb-8'>
        <Text className='mb-4 text-sm font-bold text-neutral-900'>
          Spesifikasi Utama
        </Text>
        <View className='flex-row gap-3 mb-3'>
          <Controller
            control={control}
            name='beds'
            render={({ field: { onChange, value } }) => (
              <CounterInput
                label='K. Tidur'
                value={value}
                onChange={onChange}
                icon={BedDouble}
              />
            )}
          />
          <Controller
            control={control}
            name='baths'
            render={({ field: { onChange, value } }) => (
              <CounterInput
                label='K. Mandi'
                value={value}
                onChange={onChange}
                icon={Bath}
              />
            )}
          />
        </View>
        <View className='flex-row gap-3'>
          <Controller
            control={control}
            name='floors'
            render={({ field: { onChange, value } }) => (
              <CounterInput
                label='Lantai'
                value={value}
                onChange={onChange}
                icon={Layers}
              />
            )}
          />
          <View className='flex-1' />
        </View>
      </View>

      {/* Area */}
      <View className='mb-8'>
        <Text className='mb-4 text-sm font-bold text-neutral-900'>
          Luas Area (m²)
        </Text>
        <View className='flex-row gap-4'>
          <Controller
            control={control}
            name='landAreaMin'
            render={({ field: { onChange, value } }) => (
              <View className='flex-1'>
                <Label className='mb-1.5 text-xs text-neutral-500'>
                  Luas Tanah Min.
                </Label>
                <Input
                  placeholder='60'
                  keyboardType='numeric'
                  className='bg-neutral-50 border-neutral-200'
                  value={value}
                  onChangeText={onChange}
                />
              </View>
            )}
          />
          <Controller
            control={control}
            name='buildingAreaMin'
            render={({ field: { onChange, value } }) => (
              <View className='flex-1'>
                <Label className='mb-1.5 text-xs text-neutral-500'>
                  Luas Bangunan Min.
                </Label>
                <Input
                  placeholder='36'
                  keyboardType='numeric'
                  className='bg-neutral-50 border-neutral-200'
                  value={value}
                  onChangeText={onChange}
                />
              </View>
            )}
          />
        </View>
      </View>

      {/* Advanced Filters Accordion-style layout */}
      <View className='mb-6'>
        <Text className='mb-4 text-sm font-bold text-neutral-900'>
          Detail Lanjutan
        </Text>

        <View className='gap-4'>
          <Controller
            control={control}
            name='certificate'
            render={({ field: { onChange, value } }) => {
              const options = [
                { label: 'SHM - Sertifikat Hak Milik', value: 'SHM' },
                { label: 'HGB - Hak Guna Bangunan', value: 'HGB' },
                { label: 'Strata Title', value: 'Strata' },
                { label: 'Girik / Lainnya', value: 'Lainnya' },
              ];
              const selectedOption = options.find((opt) => opt.value === value);

              return (
                <Select
                  onValueChange={(option: SearchOption) => {
                    onChange(option ? option.value : '');
                  }}
                  value={selectedOption}
                >
                  <SelectTrigger className='w-full'>
                    <View className='flex-row items-center gap-2'>
                      <FileText size={16} color='#64748b' />
                      <SelectValue placeholder='Jenis Sertifikat' />
                    </View>
                  </SelectTrigger>
                  <SelectContent insets={contentInsets}>
                    <SelectGroup>
                      {options.map((option) => (
                        <SelectItem
                          key={option.value}
                          label={option.label}
                          value={option.value}
                        />
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              );
            }}
          />

          <Controller
            control={control}
            name='electricity'
            render={({ field: { onChange, value } }) => {
              const options = [
                { label: '900 VA', value: '900' },
                { label: '1300 VA', value: '1300' },
                { label: '2200 VA', value: '2200' },
                { label: '3500 VA', value: '3500' },
                { label: '4400 VA+', value: '4400+' },
              ];
              const selectedOption = options.find((opt) => opt.value === value);

              return (
                <Select
                  onValueChange={(option: SearchOption) => {
                    onChange(option ? option.value : '');
                  }}
                  value={selectedOption}
                >
                  <SelectTrigger className='w-full'>
                    <View className='flex-row items-center gap-2'>
                      <Zap size={16} color='#64748b' />
                      <SelectValue placeholder='Daya Listrik' />
                    </View>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {options.map((option) => (
                        <SelectItem
                          key={option.value}
                          label={option.label}
                          value={option.value}
                        />
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              );
            }}
          />

          <Controller
            control={control}
            name='orientation'
            render={({ field: { onChange, value } }) => {
              const options = [
                { label: 'Utara', value: 'Utara' },
                { label: 'Selatan', value: 'Selatan' },
                { label: 'Timur', value: 'Timur' },
                { label: 'Barat', value: 'Barat' },
              ];
              const selectedOption = options.find((opt) => opt.value === value);

              return (
                <Select
                  onValueChange={(option: SearchOption) => {
                    onChange(option ? option.value : '');
                  }}
                  value={selectedOption}
                >
                  <SelectTrigger className='w-full'>
                    <View className='flex-row items-center gap-2'>
                      <Compass size={16} color='#64748b' />
                      <SelectValue placeholder='Hadap Bangunan' />
                    </View>
                  </SelectTrigger>
                  <SelectContent insets={contentInsets}>
                    <SelectGroup>
                      {options.map((option) => (
                        <SelectItem
                          key={option.value}
                          label={option.label}
                          value={option.value}
                        />
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              );
            }}
          />

          <Controller
            control={control}
            name='condition'
            render={({ field: { onChange, value } }) => {
              const options = [
                { label: 'Baru', value: 'Baru' },
                { label: 'Siap Huni', value: 'Siap Huni' },
                { label: 'Butuh Renovasi', value: 'Renovasi' },
                { label: 'Indent', value: 'Indent' },
              ];
              const selectedOption = options.find((opt) => opt.value === value);

              return (
                <Select
                  onValueChange={(option: SearchOption) => {
                    onChange(option ? option.value : '');
                  }}
                  value={selectedOption}
                >
                  <SelectTrigger className='w-full'>
                    <View className='flex-row items-center gap-2'>
                      <Hammer size={16} color='#64748b' />
                      <SelectValue placeholder='Kondisi Bangunan' />
                    </View>
                  </SelectTrigger>
                  <SelectContent insets={contentInsets}>
                    <SelectGroup>
                      {options.map((option) => (
                        <SelectItem
                          key={option.value}
                          label={option.label}
                          value={option.value}
                        />
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
};
