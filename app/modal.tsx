import { Link } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function ModalScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-xl font-semibold mb-4">Modal</Text>
        <Link href="/" dismissTo asChild>
          <Button variant="outline">
            <Text>Go Back</Text>
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}
