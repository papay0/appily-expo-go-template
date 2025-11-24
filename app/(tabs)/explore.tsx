import { StyleSheet, Switch, Appearance } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

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
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ThemedView style={styles.content}>
        <ThemedText type="title">Settings</ThemedText>

        <ThemedView style={styles.settingRow}>
          <ThemedView style={styles.settingInfo}>
            <ThemedText type="defaultSemiBold">Dark Mode</ThemedText>
            <ThemedText style={styles.settingDescription}>
              Toggle between light and dark theme
            </ThemedText>
          </ThemedView>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
          />
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 24,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flex: 1,
    gap: 4,
  },
  settingDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
});
