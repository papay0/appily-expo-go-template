import { StyleSheet, Switch, Appearance, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';

import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { TableViewGroup } from '@/components/ui/table-view-group';
import { TableViewCell } from '@/components/ui/table-view-cell';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  useEffect(() => {
    setIsDarkMode(colorScheme === 'dark');
  }, [colorScheme]);

  const toggleTheme = (value: boolean) => {
    setIsDarkMode(value);
    Appearance.setColorScheme(value ? 'dark' : 'light');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        <TableViewGroup header="Appearance">
          <TableViewCell
            title="Dark Mode"
            subtitle="Toggle between light and dark theme"
            leftIcon={
              <IconSymbol
                name="moon.fill"
                size={20}
                color={colors.tint}
              />
            }
            rightContent={
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
              />
            }
            showSeparator={false}
          />
        </TableViewGroup>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
});
