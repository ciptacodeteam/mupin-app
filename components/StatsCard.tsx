import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { TrendingUp } from 'lucide-react-native';
import { View } from 'react-native';

export interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  color?: string; // Tailwind color class prefix e.g. "blue"
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp = true,
  color = 'blue',
}: StatsCardProps) {
  // Mapping for background colors (simplified for Tailwind)
  const bgClass =
    {
      blue: 'bg-blue-50',
      orange: 'bg-orange-50',
      green: 'bg-green-50',
      purple: 'bg-purple-50',
    }[color] || 'bg-neutral-50';

  const iconColor =
    {
      blue: '#2563eb',
      orange: '#ea580c',
      green: '#16a34a',
      purple: '#9333ea',
    }[color] || '#525252';

  return (
    <Card className='w-40 p-4 mr-3 bg-white border border-0 shadow-none rounded-2xl border-neutral-100'>
      <View className='flex-row items-start justify-between mb-3'>
        <View
          className={cn(
            'items-center justify-center w-10 h-10 rounded-xl',
            bgClass
          )}
        >
          <Icon size={20} color={iconColor} />
        </View>
        {trend && (
          <View className='flex-row items-center px-1.5 py-0.5 bg-green-50 rounded-full'>
            <TrendingUp size={10} color='#16a34a' />
            <Text className='ml-1 text-[10px] font-bold text-green-700'>
              {trend}
            </Text>
          </View>
        )}
      </View>
      <View>
        <Text className='mb-1 text-xs font-medium text-neutral-500'>
          {title}
        </Text>
        <Text className='text-xl font-bold text-neutral-900'>{value}</Text>
      </View>
    </Card>
  );
}
