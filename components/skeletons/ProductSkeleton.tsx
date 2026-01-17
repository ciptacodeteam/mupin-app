import { Card, CardContent } from '@/components/ui/card';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export function ProductSkeleton() {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.5, { duration: 1000 }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Card className='py-0 mb-4 overflow-hidden shadow-sm border-neutral-100 rounded-3xl'>
      <Animated.View
        style={[animatedStyle, { height: 192, backgroundColor: '#e5e7eb' }]}
      />
      <CardContent className='gap-3 p-5 pt-4'>
        <Animated.View
          style={[
            animatedStyle,
            {
              height: 20,
              width: '80%',
              backgroundColor: '#e5e7eb',
              marginBottom: 4,
            },
          ]}
        />
        <View className='flex-row items-center'>
          <Animated.View
            style={[
              animatedStyle,
              {
                height: 14,
                width: 14,
                borderRadius: 7,
                backgroundColor: '#e5e7eb',
                marginRight: 4,
              },
            ]}
          />
          <Animated.View
            style={[
              animatedStyle,
              { height: 14, width: '60%', backgroundColor: '#e5e7eb' },
            ]}
          />
        </View>
        <View className='h-[1px] bg-neutral-100 my-1' />
        <View className='flex-row justify-between pt-1'>
          <Animated.View
            style={[
              animatedStyle,
              { height: 16, width: 60, backgroundColor: '#e5e7eb' },
            ]}
          />
          <Animated.View
            style={[
              animatedStyle,
              { height: 16, width: 60, backgroundColor: '#e5e7eb' },
            ]}
          />
          <Animated.View
            style={[
              animatedStyle,
              { height: 16, width: 60, backgroundColor: '#e5e7eb' },
            ]}
          />
        </View>
      </CardContent>
    </Card>
  );
}
