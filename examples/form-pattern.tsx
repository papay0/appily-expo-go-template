/**
 * Form Pattern Example - Keyboard Handling Reference
 *
 * This file demonstrates the CORRECT way to handle keyboard interactions in forms.
 * AI agents should reference this pattern when building screens with TextInput fields.
 *
 * KEY CONCEPTS:
 * 1. KeyboardAvoidingView with platform-specific behavior
 * 2. TouchableWithoutFeedback to dismiss keyboard on tap outside
 * 3. ScrollView with keyboardShouldPersistTaps="handled"
 * 4. TextInput refs for field navigation
 * 5. Theme-aware styling for light/dark mode
 *
 * NOTE: This file is NOT included in the navigation - it's a reference for AI agents.
 */

import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function FormPatternExample() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  // Refs for field navigation
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Theme-aware input colors
  const inputColors = {
    background: isDark ? colors.secondaryBackground : colors.secondaryBackground,
    text: colors.text,
    placeholder: colors.tertiaryText,
    border: colors.border,
    focusBorder: colors.tint,
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    setIsLoading(true);
    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false);
      // Handle form submission result
    }, 1500);
  };

  return (
    // CRITICAL: KeyboardAvoidingView must wrap the entire screen content
    // - iOS: behavior="padding" pushes content up when keyboard opens
    // - Android: behavior={undefined} - Android handles this automatically
    // - keyboardVerticalOffset: accounts for header height (adjust as needed)
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      {/* CRITICAL: TouchableWithoutFeedback dismisses keyboard on tap outside inputs */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {/* CRITICAL: keyboardShouldPersistTaps="handled" allows:
            - Tapping buttons/links while keyboard is open
            - Without this, users must dismiss keyboard before tapping submit */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              Create Account
            </Text>
            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
              Sign up to get started
            </Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.secondaryText }]}>
                Email
              </Text>
              <TextInput
                ref={emailRef}
                style={[
                  styles.input,
                  {
                    backgroundColor: inputColors.background,
                    color: inputColors.text,
                    borderColor: inputColors.border,
                  },
                ]}
                placeholder="you@example.com"
                placeholderTextColor={inputColors.placeholder}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                // IMPORTANT: returnKeyType shows "Next" on keyboard
                returnKeyType="next"
                // IMPORTANT: onSubmitEditing moves focus to next field
                onSubmitEditing={() => passwordRef.current?.focus()}
                // IMPORTANT: blurOnSubmit={false} keeps keyboard open when moving to next field
                blurOnSubmit={false}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.secondaryText }]}>
                Password
              </Text>
              <TextInput
                ref={passwordRef}
                style={[
                  styles.input,
                  {
                    backgroundColor: inputColors.background,
                    color: inputColors.text,
                    borderColor: inputColors.border,
                  },
                ]}
                placeholder="Enter your password"
                placeholderTextColor={inputColors.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.secondaryText }]}>
                Confirm Password
              </Text>
              <TextInput
                ref={confirmPasswordRef}
                style={[
                  styles.input,
                  {
                    backgroundColor: inputColors.background,
                    color: inputColors.text,
                    borderColor: inputColors.border,
                  },
                ]}
                placeholder="Confirm your password"
                placeholderTextColor={inputColors.placeholder}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                // IMPORTANT: Last field uses returnKeyType="done" and submits form
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
            </View>

            {/* Submit Button */}
            <Pressable
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: colors.tint },
                pressed && styles.buttonPressed,
              ]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </Pressable>

            {/* Secondary action - also tappable when keyboard is open */}
            <Pressable style={styles.linkButton}>
              <Text style={[styles.linkText, { color: colors.tint }]}>
                Already have an account? Sign in
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  inputContainer: {
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
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 52,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    padding: 12,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
