import { ScrollView, Switch, Appearance, View } from 'react-native';
import { useState, useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Moon, Sun } from 'lucide-react-native';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  useEffect(() => {
    setIsDarkMode(colorScheme === 'dark');
  }, [colorScheme]);

  const toggleTheme = (value: boolean) => {
    setIsDarkMode(value);
    Appearance.setColorScheme(value ? 'dark' : 'light');
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-6"
        contentInsetAdjustmentBehavior="automatic"
      >
        <Card>
          <CardContent className="py-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="bg-muted rounded-lg p-2">
                  <Icon as={isDarkMode ? Moon : Sun} size={20} className="text-foreground" />
                </View>
                <Text className="font-medium">Dark Mode</Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
              />
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
}
