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
  FileText,
  Heart,
  Layers,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
} from 'lucide-react-native';
import { Linking, Share, TouchableOpacity, View } from 'react-native';

export interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  address: string;
  specs: {
    beds: number;
    baths: number;
    area: number; // in m2
    floors?: number;
  };
  image: string | number;
  type: string;
  onPress: () => void;
  showActions?: boolean;
  listingCode?: string;
  status?: string; // e.g. "DIJUAL"
  certificate?: string; // e.g. "SHM"
  postedAt?: string; // e.g. "11 Okt 2024"
  agent?: {
    name: string;
    photo: string | null;
    phone: string;
  };
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
  listingCode = '',
  status = 'DIJUAL',
  certificate = 'SHM',
  postedAt,
  agent,
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
        type: type as any,
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

  const handleCall = () => {
    if (agent?.phone) {
      Linking.openURL(`tel:${agent.phone}`);
    }
  };

  const handleWhatsApp = () => {
    if (agent?.phone) {
      let phoneNumber = agent.phone;
      if (phoneNumber.startsWith('0')) {
        phoneNumber = '62' + phoneNumber.slice(1);
      }
      const message = `Halo ${agent.name}, saya tertarik dengan properti ${title} (#${listingCode})`;
      Linking.openURL(
        `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`,
      );
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Card className='py-0 mb-4 overflow-hidden bg-white shadow-sm border-neutral-200 rounded-2xl'>
        {/* Image Section */}
        <View className='relative h-56'>
          <Image
            source={image}
            style={{ width: '100%', height: '100%' }}
            contentFit='cover'
            transition={200}
          />
          {/* Action Buttons */}
          {showActions && (
            <View className='absolute flex-row gap-2 top-3 right-3'>
              <TouchableOpacity
                onPress={handleShare}
                className='items-center justify-center rounded-full w-9 h-9 bg-black/20 backdrop-blur-md'
              >
                <Share2 size={18} color='#FFF' />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleToggleFavorite}
                className='items-center justify-center rounded-full w-9 h-9 bg-black/20 backdrop-blur-md'
              >
                <Heart
                  size={18}
                  color={isFav ? '#ef4444' : '#FFF'}
                  fill={isFav ? '#ef4444' : 'transparent'}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Content Section */}
        <CardContent className='gap-2 p-4 pt-0'>
          {/* Badges Row */}
          <View className='flex-row items-center justify-between'>
            <View className='flex-row gap-2'>
              <View className='px-2 py-1 bg-yellow-100 rounded'>
                <Text className='text-[10px] font-bold text-yellow-700 uppercase'>
                  {status}
                </Text>
              </View>
              <View className='px-2 py-1 bg-yellow-100 rounded'>
                <Text className='text-[10px] font-bold text-yellow-700 uppercase'>
                  {type}
                </Text>
              </View>
            </View>
            <Text className='text-xs font-medium text-neutral-400'>
              #{listingCode}
            </Text>
          </View>

          {/* Price */}
          <Text className='mt-1 text-xl font-bold text-blue-900'>
            {formatCurrency(price, 'id-ID', 'IDR')}
          </Text>

          {/* Title */}
          <Text className='text-base font-bold leading-6 text-neutral-900 line-clamp-2'>
            {title}
          </Text>

          {/* Location */}
          <View className='flex-row items-center'>
            <MapPin size={14} color='#1e293b' />
            <Text className='ml-1.5 text-xs text-neutral-600 flex-1 line-clamp-1'>
              {address}
            </Text>
          </View>

          {/* Features Row */}
          <View className='flex-row items-center gap-4 mt-2 mb-1'>
            <View className='flex-row items-center gap-1.5'>
              <BedDouble size={16} color='#64748b' />
              <Text className='text-xs font-medium text-neutral-600'>
                {specs.beds} Beds
              </Text>
            </View>
            <View className='flex-row items-center gap-1.5'>
              <Bath size={16} color='#64748b' />
              <Text className='text-xs font-medium text-neutral-600'>
                {specs.baths} Baths
              </Text>
            </View>
            {!!specs.floors && (
              <View className='flex-row items-center gap-1.5'>
                <Layers size={16} color='#64748b' />
                <Text className='text-xs font-medium text-neutral-600'>
                  {specs.floors} Floors
                </Text>
              </View>
            )}
            <View className='flex-row items-center gap-1.5'>
              <FileText size={16} color='#64748b' />
              <Text className='text-xs font-medium text-neutral-600'>
                {certificate}
              </Text>
            </View>
          </View>

          {/* Posted Date */}
          <Text className='text-[10px] text-neutral-400 text-right mt-1'>
            Diposting {postedAt || '-'}
          </Text>

          <View className='h-[1px] bg-neutral-100 my-2' />

          {/* Agent Footer */}
          <View className='flex-row items-center justify-between'>
            <View className='flex-row items-center flex-1'>
              <Image
                source={
                  agent?.photo
                    ? { uri: agent.photo }
                    : 'https://via.placeholder.com/100'
                }
                style={{ width: 40, height: 40, borderRadius: 20 }}
                contentFit='cover'
              />
              <View className='flex-1 ml-3'>
                <Text className='text-sm font-bold text-neutral-900 line-clamp-1'>
                  {agent?.name ? agent.name : 'Agen Mupin'}
                </Text>
                <Text className='text-xs text-neutral-500'>Agen</Text>
              </View>
            </View>

            <View className='flex-row gap-2'>
              <TouchableOpacity
                onPress={handleCall}
                className='items-center justify-center bg-blue-100 rounded-full w-9 h-9'
              >
                <Phone size={18} color='#2563eb' />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleWhatsApp}
                className='items-center justify-center bg-green-100 rounded-full w-9 h-9'
              >
                <MessageCircle size={18} color='#16a34a' />
              </TouchableOpacity>
            </View>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
}
