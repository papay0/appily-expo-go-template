import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

import { Progress } from '@/components/ui/progress';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Sparkles } from 'lucide-react-native';

export default function HomeScreen() {
  const [progress, setProgress] = useState(0);
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    // Gentle pulse animation
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Slow progress animation (loops at 90%)
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 15;
        return prev + 0.5;
      });
    }, 50);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  return (
    <View className="flex-1 bg-background items-center justify-center px-8">
      <Animated.View style={pulseStyle} className="mb-8">
        <View className="bg-primary/10 rounded-full p-5">
          <Icon as={Sparkles} className="text-primary" size={40} />
        </View>
      </Animated.View>

      <Text className="text-2xl font-semibold text-foreground mb-2 text-center">
        Your app is being built...
      </Text>

      <Text variant="muted" className="text-center mb-8">
        This will only take a moment
      </Text>

      <View className="w-full max-w-xs">
        <Progress value={progress} className="h-2" />
      </View>
    </View>
  );
}
