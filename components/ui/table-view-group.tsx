import { StyleSheet, View } from 'react-native';
import { ReactNode } from 'react';

import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

type TableViewGroupProps = {
  header?: string;
  footer?: string;
  children: ReactNode;
};

export function TableViewGroup({ header, footer, children }: TableViewGroupProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.container}>
      {header && (
        <ThemedText style={styles.header}>
          {header}
        </ThemedText>
      )}
      <View style={[styles.group, { backgroundColor: colors.secondaryBackground }]}>
        {children}
      </View>
      {footer && (
        <ThemedText style={styles.footer}>
          {footer}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 35,
  },
  header: {
    fontSize: 13,
    textTransform: 'uppercase',
    opacity: 0.6,
    marginBottom: 6,
    marginLeft: 16,
    fontWeight: '400',
  },
  group: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  footer: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 6,
    marginLeft: 16,
    marginRight: 16,
    lineHeight: 18,
  },
});
