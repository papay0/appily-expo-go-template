import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Pressable } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ErrorBoundary } from '@/components/error-boundary';
import { reportError, isErrorReportingEnabled } from '@/lib/error-reporter';

function SettingsButton() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // iOS 26 workaround: header buttons need minWidth 36 and centered content
  // See: https://github.com/software-mansion/react-native-screens/issues/2990
  return (
    <Pressable
      onPress={() => router.push('/settings')}
      style={{
        minWidth: 36,
        minHeight: 36,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {({ pressed }) => (
        <Ionicons
          name="settings-outline"
          size={24}
          color={colors.tint}
          style={{ opacity: pressed ? 0.5 : 1 }}
        />
      )}
    </Pressable>
  );
}

// Declare ErrorUtils type (React Native internal)
declare const ErrorUtils: {
  getGlobalHandler: () => (error: Error, isFatal?: boolean) => void;
  setGlobalHandler: (handler: (error: Error, isFatal?: boolean) => void) => void;
};

/**
 * Setup global error handlers to catch unhandled JS exceptions
 * and unhandled promise rejections.
 *
 * These handlers report errors to the Appily backend while still
 * allowing the default React Native error handling (Redbox in dev).
 */
function setupGlobalErrorHandlers(): void {
  // Skip setup if error reporting is not enabled (no projectId)
  if (!isErrorReportingEnabled()) {
    console.log('[Appily] Error reporting not configured - skipping global handlers');
    return;
  }

  console.log('[Appily] Setting up global error handlers');

  // Capture the original error handler to chain with it
  const originalHandler = ErrorUtils.getGlobalHandler();

  // Set up global JS exception handler
  ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
    // Report to Appily backend (fire and forget - XHR will complete in background)
    reportError({
      message: error.message || String(error),
      stack: error.stack,
      errorType: 'js_error',
      timestamp: new Date().toISOString(),
    });

    // Call original handler (shows Redbox in dev mode)
    if (originalHandler) {
      originalHandler(error, isFatal);
    }
  });

  // Set up unhandled promise rejection handler
  // Using the global tracking API when available
  if (typeof global !== 'undefined') {
    const originalPromiseRejectionHandler = (global as Record<string, unknown>).onunhandledrejection as
      | ((event: { reason: unknown }) => void)
      | undefined;

    (global as Record<string, unknown>).onunhandledrejection = (event: { reason: unknown }) => {
      const error = event.reason;
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;

      reportError({
        message: errorMessage,
        stack: errorStack,
        errorType: 'unhandled_promise',
        timestamp: new Date().toISOString(),
      });

      // Call original handler if it exists
      if (originalPromiseRejectionHandler) {
        originalPromiseRejectionHandler(event);
      }
    };
  }
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Set up global error handlers on mount
  useEffect(() => {
    setupGlobalErrorHandlers();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: 'Home',
              // Set to false for a smaller header that takes less space
              headerLargeTitle: true,
              headerRight: () => <SettingsButton />,
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              title: 'Settings',
              headerLargeTitle: true,
            }}
          />
          <Stack.Screen
            name="modal"
            options={{
              presentation: 'modal',
              title: 'Modal',
              headerLargeTitle: false,
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
