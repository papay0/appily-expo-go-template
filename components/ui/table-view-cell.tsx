import { StyleSheet, View, Pressable, ViewStyle } from 'react-native';
import { ReactNode } from 'react';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

type TableViewCellProps = {
  title: string;
  subtitle?: string;
  leftIcon?: ReactNode;
  rightContent?: ReactNode;
  onPress?: () => void;
  showSeparator?: boolean;
  style?: ViewStyle;
};

export function TableViewCell({
  title,
  subtitle,
  leftIcon,
  rightContent,
  onPress,
  showSeparator = true,
  style,
}: TableViewCellProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const content = (
    <View
      style={[
        styles.cell,
        { backgroundColor: colors.secondaryBackground },
        style,
      ]}
    >
      <View style={styles.leftContent}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        <View style={styles.textContainer}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          {subtitle && (
            <ThemedText style={[styles.subtitle, { color: colors.secondaryText }]}>
              {subtitle}
            </ThemedText>
          )}
        </View>
      </View>
      {rightContent && <View style={styles.rightContent}>{rightContent}</View>}
      {showSeparator && (
        <View
          style={[
            styles.separator,
            { backgroundColor: colors.separator },
            leftIcon ? { marginLeft: 60 } : { marginLeft: 16 },
          ]}
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          { opacity: pressed ? 0.6 : 1 },
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 16,
    minHeight: 44,
    position: 'relative',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 12,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 20,
  },
  rightContent: {
    marginLeft: 12,
  },
  separator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    height: StyleSheet.hairlineWidth,
  },
});
