import { Link } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function ModalScreen() {
  return (
    <View className="flex-1 bg-background items-center justify-center p-6">
      <Text className="text-xl font-semibold mb-4">Modal</Text>
      <Link href="/" dismissTo asChild>
        <Button variant="outline">
          <Text>Go Back</Text>
        </Button>
      </Link>
    </View>
  );
}
