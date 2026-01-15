import { PropertyCard } from '@/components/PropertyCard';
import { StatsCard } from '@/components/StatsCard';
import { Text } from '@/components/ui/text';
import useAuthStore from '@/stores/useAuthStore';
import { useRouter } from 'expo-router';
import {
  Bell,
  Building2,
  Home,
  Search,
  SlidersHorizontal,
  Users,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StatusBar, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock Data
const MOCK_PROPERTIES = [
  {
    id: '1',
    title: 'Modern Minimalist House',
    price: 1500000000,
    address: 'Jl. Melati No. 23, Jakarta Selatan',
    specs: { beds: 3, baths: 2, area: 120 },
    type: 'Rumah',
    image:
      'https://images.unsplash.com/photo-1600596542815-2495db98dada?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    title: 'Luxury Apartment CBD',
    price: 2800000000,
    address: 'Kuningan City View, Lt. 15',
    specs: { beds: 2, baths: 1, area: 85 },
    type: 'Apartemen',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    title: 'Ruko 3 Lantai Strategis',
    price: 3500000000,
    address: 'Jl. Raya Bogor KM 20',
    specs: { beds: 0, baths: 3, area: 240 },
    type: 'Ruko',
    image:
      'https://images.unsplash.com/photo-1542361345-89e58247f2d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4',
    title: 'Kost Eksklusif Full Furnished',
    price: 4500000000,
    address: 'Dekat Kampus UI Depok',
    specs: { beds: 10, baths: 10, area: 300 },
    type: 'Kost',
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
] as const;

const FILTERS = ['Semua', 'Rumah', 'Apartemen', 'Ruko', 'Kost', 'Tanah'];

const HomeScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const [activeFilter, setActiveFilter] = useState('Semua');

  const filteredProperties =
    activeFilter === 'Semua'
      ? MOCK_PROPERTIES
      : MOCK_PROPERTIES.filter((p) => p.type === activeFilter);

  return (
    <View className='flex-1 bg-white'>
      <StatusBar barStyle='dark-content' />

      {/* Header Section */}
      <View
        className='z-10 px-6 pb-4 bg-white border-b border-neutral-100'
        style={{ paddingTop: insets.top + 10 }}
      >
        <View className='flex-row items-center justify-between mb-4'>
          <View className='flex-row items-center'>
            <View className='items-center justify-center w-10 h-10 bg-blue-100 rounded-full'>
              <Text className='text-lg font-bold text-blue-600'>
                {user?.name?.charAt(0) || 'U'}
              </Text>
            </View>
            <View className='ml-3'>
              <Text className='text-xs text-neutral-500'>Selamat Datang,</Text>
              <Text className='text-base font-bold text-neutral-900'>
                {user?.name || 'User'}
              </Text>
            </View>
          </View>
          <TouchableOpacity className='items-center justify-center w-10 h-10 bg-white border rounded-full shadow-sm border-neutral-200'>
            <Bell size={20} color='#334155' />
            <View className='absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white' />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          onPress={() => router.push('/search')}
          activeOpacity={0.9}
        >
          <View className='flex-row items-center h-12 px-4 bg-neutral-100 rounded-2xl'>
            <Search size={20} color='#94a3b8' />
            <Text className='flex-1 ml-3 text-sm text-neutral-500'>
              Cari properti, lokasi, atau proyek...
            </Text>
            <View className='h-6 w-[1px] bg-neutral-300 mx-2' />
            <SlidersHorizontal size={18} color='#64748b' />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Stats Section */}
        <View className='pt-6'>
          <Text className='px-6 mb-4 text-lg font-bold text-neutral-900'>
            Dashboard Overview
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
          >
            <StatsCard
              title='Total Properti'
              value='124'
              icon={Building2}
              trend='+12%'
              color='blue'
            />
            <StatsCard
              title='Properti Terjual'
              value='45'
              icon={Home}
              trend='+5%'
              color='green'
            />
            <StatsCard
              title='Agen Aktif'
              value='12'
              icon={Users}
              color='orange'
            />
          </ScrollView>
        </View>

        {/* Filters */}
        <View className='mt-8'>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}
          >
            {FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full border ${
                  activeFilter === filter
                    ? 'bg-blue-600 border-blue-600'
                    : 'bg-white border-neutral-200'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    activeFilter === filter ? 'text-white' : 'text-neutral-600'
                  }`}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Property List */}
        <View className='px-6 mt-6'>
          <View className='flex-row items-center justify-between mb-4'>
            <Text className='text-lg font-bold text-neutral-900'>
              Properti Unggulan
            </Text>
            <TouchableOpacity onPress={() => router.push('/search')}>
              <Text className='text-sm font-medium text-blue-600'>
                Lihat Semua
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                {...property}
                onPress={() => router.push(`/property/${property.id}`)}
              />
            ))}
            {filteredProperties.length === 0 && (
              <View className='items-center justify-center py-10'>
                <Text className='text-neutral-400'>
                  Tidak ada properti ditemukan.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
