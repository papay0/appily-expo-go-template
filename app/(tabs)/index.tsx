import { StyleSheet, ScrollView } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        <ThemedView style={styles.welcome}>
          <ThemedText style={styles.welcomeText}>
            Welcome!
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.secondaryText }]}>
            Start building your app here.
          </ThemedText>
        </ThemedView>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  welcome: {
    gap: 8,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
});
