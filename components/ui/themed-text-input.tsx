/**
 * ThemedTextInput - A theme-aware TextInput component
 *
 * Features:
 * - Automatic light/dark mode styling
 * - Focus state with accent border color
 * - iOS-style rounded corners and padding
 * - Supports all standard TextInput props
 * - Optional label and error message
 */

import { forwardRef, useState } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface ThemedTextInputProps extends TextInputProps {
  /** Optional label shown above the input */
  label?: string;
  /** Optional error message shown below the input */
  error?: string;
  /** Custom container style */
  containerStyle?: object;
}

export const ThemedTextInput = forwardRef<TextInput, ThemedTextInputProps>(
  ({ label, error, containerStyle, style, ...props }, ref) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const isDark = colorScheme === 'dark';

    const [isFocused, setIsFocused] = useState(false);

    // Theme-aware colors
    const inputColors = {
      background: isDark ? colors.secondaryBackground : colors.secondaryBackground,
      text: colors.text,
      placeholder: colors.tertiaryText,
      border: error ? '#FF3B30' : isFocused ? colors.tint : colors.border,
      label: colors.secondaryText,
      error: '#FF3B30',
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={[styles.label, { color: inputColors.label }]}>
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            {
              backgroundColor: inputColors.background,
              color: inputColors.text,
              borderColor: inputColors.border,
            },
            style,
          ]}
          placeholderTextColor={inputColors.placeholder}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        {error && (
          <Text style={[styles.error, { color: inputColors.error }]}>
            {error}
          </Text>
        )}
      </View>
    );
  }
);

ThemedTextInput.displayName = 'ThemedTextInput';

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  error: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ThemedTextInput;
