import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

import { Text } from '@/components/ui/text';

export default function HomeScreen() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <View className="flex-1 bg-background items-center justify-center px-8">
      <ActivityIndicator size="large" className="mb-8" />

      <Text className="text-2xl font-semibold text-foreground mb-2 text-center">
        Your app is being built{dots}
      </Text>

      <Text variant="muted" className="text-center">
        This will only take a moment
      </Text>
    </View>
  );
}
