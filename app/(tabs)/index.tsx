import { PropertyCard } from '@/components/PropertyCard';
import { StatsCard } from '@/components/StatsCard';
import { ProductSkeleton } from '@/components/skeletons/ProductSkeleton';
import { Text } from '@/components/ui/text';
import { useProducts, useSubCategories } from '@/hooks/useProducts';
import useAuthStore from '@/stores/useAuthStore';
import { Product } from '@/types/product';
import { useRouter } from 'expo-router';
import {
  Bell,
  Building2,
  Home,
  Search,
  SlidersHorizontal,
  Users,
} from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);

  const [activeFilterId, setActiveFilterId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: productsData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchProducts,
  } = useProducts(10, activeFilterId);
  const { refetch: refetchSubCategories, data: subCategoriesData } =
    useSubCategories();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchProducts(), refetchSubCategories()]);
    setRefreshing(false);
  }, [refetchProducts, refetchSubCategories]);

  // Mempersiapkan list filter: 'Semua' (id: null) + data dari API
  const filters = useMemo(
    () => [
      { id: null, name: 'Semua' },
      ...(subCategoriesData?.results.map((cat) => ({
        id: cat.id,
        name: cat.name,
      })) || []),
    ],
    [subCategoriesData],
  );

  const flatData = useMemo(
    () =>
      productsData?.pages.flatMap((page) => page.results.data) ||
      ([] as Product[]),
    [productsData],
  );

  const renderHeader = useCallback(
    () => (
      <View>
        {/* Stats Section */}
        <View className='pt-6'>
          <Text className='px-6 mb-4 text-lg font-bold text-neutral-900'>
            Dashboard Overview
          </Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
            data={[
              {
                title: 'Total Properti',
                value: '124',
                icon: Building2,
                trend: '+12%',
                color: 'blue',
              },
              {
                title: 'Properti Terjual',
                value: '45',
                icon: Home,
                trend: '+5%',
                color: 'green',
              },
              {
                title: 'Agen Aktif',
                value: '12',
                icon: Users,
                color: 'orange',
              },
            ]}
            renderItem={({ item }) => (
              <StatsCard
                title={item.title}
                value={item.value}
                icon={item.icon}
                trend={item.trend}
                color={item.color as any}
              />
            )}
            keyExtractor={(item) => item.title}
          />
        </View>

        {/* Filters */}
        <View className='mt-8'>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}
            data={filters}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setActiveFilterId(item.id)}
                className={`px-5 py-2 rounded-full border ${
                  activeFilterId === item.id
                    ? 'bg-blue-600 border-blue-600'
                    : 'bg-white border-neutral-200'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    activeFilterId === item.id
                      ? 'text-white'
                      : 'text-neutral-600'
                  }`}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => (item.id ?? 'all').toString()}
          />
        </View>

        <View className='px-4 mt-6 mb-4'>
          <View className='flex-row items-center justify-between'>
            <Text className='text-lg font-bold text-neutral-900'>
              Properti Terbaru
            </Text>
            <TouchableOpacity onPress={() => router.push('/search')}>
              <Text className='font-medium text-blue-600'>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ),
    [activeFilterId, filters, router],
  );

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <View className='px-4 mb-4'>
        <PropertyCard
          id={item.id.toString()}
          title={item.title}
          price={item.price}
          address={item.address}
          specs={{
            beds: item.bedrooms || 0,
            baths: item.bathrooms || 0,
            area: parseInt(item.building_area) || 0,
            floors: item.floors || 0,
          }}
          image={
            item.images.length > 0
              ? item.images[0].image
              : 'https://via.placeholder.com/400x300'
          }
          type={
            (item.category.name as 'Rumah' | 'Apartemen' | 'Ruko' | 'Kost') ||
            'Rumah'
          }
          onPress={() => router.push(`/property/${item.id}`)}
          listingCode={item.id.toString()}
          status='DIJUAL' // Hardcoded for now based on reference, could be dynamic
          certificate={item.certificate}
          postedAt={new Date(item.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
          agent={{
            name: item.staff.name,
            photo: item.staff.photo,
            phone: item.staff.phone,
          }}
        />
      </View>
    ),
    [router],
  );

  const renderFooter = useCallback(() => {
    if (isFetchingNextPage) {
      return (
        <View className='items-center py-4'>
          <ActivityIndicator size='small' color='#3b82f6' />
        </View>
      );
    }
    return <View className='h-24' />;
  }, [isFetchingNextPage]);

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return (
        <View className='px-4'>
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
        </View>
      );
    }
    return (
      <View className='items-center justify-center py-10'>
        <Text className='font-medium text-neutral-500'>
          Tidak ada properti ditemukan
        </Text>
      </View>
    );
  }, [isLoading]);

  return (
    <View className='flex-1 bg-white'>
      <StatusBar barStyle='dark-content' />

      {/* Header Section (Fixed) */}
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

      <FlatList
        data={flatData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
