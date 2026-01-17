import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { formatCurrency } from '@/lib/utils';
import useFavoritesStore, {
  FavoriteProperty,
} from '@/stores/useFavoritesStore';
import { Image } from 'expo-image';
import {
  Bath,
  BedDouble,
  Heart,
  MapPin,
  Ruler,
  Share2,
} from 'lucide-react-native';
import { Share, TouchableOpacity, View } from 'react-native';

export interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  address: string;
  specs: {
    beds: number;
    baths: number;
    area: number; // in m2
  };
  image: string | number; // URL or require()
  type: 'Rumah' | 'Apartemen' | 'Ruko' | 'Kost';
  onPress: () => void;
  showActions?: boolean;
}

export function PropertyCard({
  id,
  title,
  price,
  address,
  specs,
  image,
  type,
  onPress,
  showActions = true,
}: PropertyCardProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const isFav = isFavorite(id);

  const handleToggleFavorite = () => {
    if (isFav) {
      removeFavorite(id);
    } else {
      const property: FavoriteProperty = {
        id,
        title,
        price,
        address,
        specs,
        image: typeof image === 'string' ? image : '',
        type,
      };
      addFavorite(property);
    }
  };

  const handleShare = async () => {
    try {
      const message = `🏠 ${title}\n\n💰 ${formatCurrency(price, 'id-ID', 'IDR')}\n📍 ${address}\n\n🛏️ ${specs.beds} Kamar Tidur\n🚿 ${specs.baths} Kamar Mandi\n📐 ${specs.area} m²\n\n#${type} #Properti #MupinApp`;
      await Share.share({
        message,
        title: title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Card className='py-0 mb-4 overflow-hidden shadow-sm border-neutral-100 rounded-3xl'>
        {/* Image Section */}
        <View className='relative h-48'>
          <Image
            source={image}
            style={{ width: '100%', height: '100%' }}
            contentFit='cover'
            transition={200}
          />
          <View className='absolute px-3 py-1 rounded-full bg-white/90 top-4 left-4 backdrop-blur-md'>
            <Text className='text-xs font-bold tracking-wider text-blue-600 uppercase'>
              {type}
            </Text>
          </View>

          {/* Action Buttons */}
          {showActions && (
            <View className='absolute flex-row gap-2 top-4 right-4'>
              <TouchableOpacity
                onPress={handleShare}
                className='items-center justify-center rounded-full w-9 h-9 bg-white/90 backdrop-blur-md'
              >
                <Share2 size={18} color='#374151' />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleToggleFavorite}
                className='items-center justify-center rounded-full w-9 h-9 bg-white/90 backdrop-blur-md'
              >
                <Heart
                  size={18}
                  color={isFav ? '#ef4444' : '#374151'}
                  fill={isFav ? '#ef4444' : 'transparent'}
                />
              </TouchableOpacity>
            </View>
          )}
          <View className='absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent' />

          <Text className='absolute text-2xl font-bold text-white shadow-sm bottom-4 left-4'>
            {formatCurrency(price, 'id-ID', 'IDR')}
          </Text>
        </View>

        {/* Content Section */}
        <CardContent className='gap-3 p-5 pt-0'>
          <View>
            <Text className='mb-1 text-lg font-bold text-neutral-900 line-clamp-1'>
              {title}
            </Text>
            <View className='flex-row items-center'>
              <MapPin size={14} color='#64748b' />
              <Text className='flex-1 ml-1 text-sm text-neutral-500 line-clamp-1'>
                {address}
              </Text>
            </View>
          </View>

          <View className='h-[1px] bg-neutral-100 my-1' />

          {/* Specs */}
          <View className='flex-row justify-between pt-1'>
            <View className='flex-row items-center gap-1.5'>
              <View className='items-center justify-center w-8 h-8 rounded-full bg-blue-50'>
                <BedDouble size={16} color='#2563eb' />
              </View>
              <Text className='text-sm font-medium text-neutral-600'>
                {specs.beds} KT
              </Text>
            </View>

            <View className='flex-row items-center gap-1.5'>
              <View className='items-center justify-center w-8 h-8 rounded-full bg-blue-50'>
                <Bath size={16} color='#2563eb' />
              </View>
              <Text className='text-sm font-medium text-neutral-600'>
                {specs.baths} KM
              </Text>
            </View>

            <View className='flex-row items-center gap-1.5'>
              <View className='items-center justify-center w-8 h-8 rounded-full bg-blue-50'>
                <Ruler size={16} color='#2563eb' />
              </View>
              <Text className='text-sm font-medium text-neutral-600'>
                {specs.area} m²
              </Text>
            </View>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
}
