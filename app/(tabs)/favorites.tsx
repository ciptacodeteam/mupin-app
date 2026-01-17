import { PropertyCard } from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Text } from '@/components/ui/text';
import { formatCurrency } from '@/lib/utils';
import useFavoritesStore from '@/stores/useFavoritesStore';
import { useRouter } from 'expo-router';
import { CheckSquare, Heart, Share2, Trash2, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  Share,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FavoriteScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { favorites, removeFavorites } = useFavoritesStore();

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === favorites.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(favorites.map((f) => f.id));
    }
  };

  const cancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedIds([]);
  };

  const handleRemoveSelected = () => {
    if (selectedIds.length === 0) return;

    Alert.alert(
      'Hapus Favorit',
      `Apakah Anda yakin ingin menghapus ${selectedIds.length} properti dari favorit?`,
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            removeFavorites(selectedIds);
            cancelSelection();
          },
        },
      ]
    );
  };

  const handleShareSelected = async () => {
    if (selectedIds.length === 0) return;

    const selectedProperties = favorites.filter((f) =>
      selectedIds.includes(f.id)
    );

    const messages = selectedProperties.map(
      (property) =>
        `🏠 ${property.title}\n💰 ${formatCurrency(property.price, 'id-ID', 'IDR')}\n📍 ${property.address}\n🛏️ ${property.specs.beds} KT | 🚿 ${property.specs.baths} KM | 📐 ${property.specs.area} m²`
    );

    const shareMessage = `📋 Daftar Favorit Properti (${selectedProperties.length} properti)\n\n${messages.join('\n\n---\n\n')}\n\n#Properti #MupinApp`;

    try {
      await Share.share({
        message: shareMessage,
        title: 'Bagikan Properti Favorit',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <View className='flex-1 bg-white'>
      <StatusBar barStyle='dark-content' />

      {/* Header */}
      <View
        className='z-10 px-6 pb-4 bg-white border-b border-neutral-100'
        style={{ paddingTop: insets.top + 10 }}
      >
        <View className='flex-row items-center justify-between'>
          <View className='flex-row items-center gap-3'>
            <View className='items-center justify-center w-10 h-10 rounded-full bg-red-50'>
              <Heart size={20} color='#ef4444' fill='#ef4444' />
            </View>
            <View>
              <Text className='text-lg font-bold text-neutral-900'>
                Favorit Saya
              </Text>
              <Text className='text-xs text-neutral-500'>
                {favorites.length} properti tersimpan
              </Text>
            </View>
          </View>

          {favorites.length > 0 && !isSelectionMode && (
            <TouchableOpacity
              onPress={() => setIsSelectionMode(true)}
              className='flex-row items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-100'
            >
              <CheckSquare size={16} color='#374151' />
              <Text className='text-sm font-medium text-neutral-700'>
                Pilih
              </Text>
            </TouchableOpacity>
          )}

          {isSelectionMode && (
            <TouchableOpacity onPress={cancelSelection}>
              <X size={24} color='#374151' />
            </TouchableOpacity>
          )}
        </View>

        {/* Selection Mode Header */}
        {isSelectionMode && (
          <View className='flex-row items-center justify-between pt-4 mt-4 border-t border-neutral-100'>
            <TouchableOpacity
              onPress={selectAll}
              className='flex-row items-center gap-2'
            >
              <Checkbox
                checked={
                  selectedIds.length === favorites.length &&
                  favorites.length > 0
                }
                onCheckedChange={selectAll}
              />
              <Text className='text-sm font-medium text-neutral-700'>
                {selectedIds.length === favorites.length
                  ? 'Batalkan Semua'
                  : 'Pilih Semua'}
              </Text>
            </TouchableOpacity>
            <Text className='text-sm text-neutral-500'>
              {selectedIds.length} dipilih
            </Text>
          </View>
        )}
      </View>

      {favorites.length === 0 ? (
        <View className='items-center justify-center flex-1 px-6'>
          <View className='items-center justify-center w-20 h-20 mb-4 rounded-full bg-neutral-100'>
            <Heart size={32} color='#d1d5db' />
          </View>
          <Text className='mb-2 text-lg font-bold text-neutral-700'>
            Belum Ada Favorit
          </Text>
          <Text className='mb-6 text-sm text-center text-neutral-500'>
            Simpan properti favorit Anda dengan menekan tombol hati pada halaman
            properti.
          </Text>
          <Button
            onPress={() => router.push('/(tabs)/home')}
            className='px-6 bg-blue-600 rounded-xl'
          >
            <Text className='font-medium text-white'>Jelajahi Properti</Text>
          </Button>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
        >
          <View className='pt-6'>
            {favorites.map((property) => (
              <View key={property.id} className='relative'>
                {isSelectionMode && (
                  <TouchableOpacity
                    onPress={() => toggleSelection(property.id)}
                    className='absolute z-10 left-3 top-6'
                  >
                    <View
                      className={`w-6 h-6 rounded-md border-2 items-center justify-center ${
                        selectedIds.includes(property.id)
                          ? 'bg-blue-600 border-blue-600'
                          : 'bg-white/90 border-neutral-300'
                      }`}
                    >
                      {selectedIds.includes(property.id) && (
                        <CheckSquare size={14} color='white' />
                      )}
                    </View>
                  </TouchableOpacity>
                )}
                <PropertyCard
                  {...property}
                  onPress={() => {
                    if (isSelectionMode) {
                      toggleSelection(property.id);
                    } else {
                      router.push(`/property/${property.id}`);
                    }
                  }}
                  showActions={!isSelectionMode}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Bottom Action Bar */}
      {isSelectionMode && selectedIds.length > 0 && (
        <View
          className='absolute bottom-0 left-0 right-0 flex-row gap-3 p-4 bg-white border-t border-neutral-100'
          style={{ paddingBottom: insets.bottom + 20 }}
        >
          <Button
            onPress={handleRemoveSelected}
            className='flex-1 flex-row items-center justify-center gap-2 border bg-white border-red-200 rounded-xl active:bg-red-50'
          >
            <Trash2 size={18} color='#ef4444' />
            <Text className='font-medium text-red-500'>
              Hapus ({selectedIds.length})
            </Text>
          </Button>
          <Button
            onPress={handleShareSelected}
            className='flex-1 flex-row items-center justify-center gap-2 bg-blue-600 rounded-xl active:bg-blue-700'
          >
            <Share2 size={18} color='white' />
            <Text className='font-medium text-white'>
              Bagikan ({selectedIds.length})
            </Text>
          </Button>
        </View>
      )}
    </View>
  );
};

export default FavoriteScreen;
