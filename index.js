// Appily Expo Template Entry Point
// This file enables apps to work both standalone and inside the Appily sandbox

import { Platform, AppRegistry, LogBox } from 'react-native';

// Only apply polyfills on native platforms (iOS/Android)
// Web and Node.js (bundler) already have these APIs
if (Platform.OS !== 'web') {
  // TextEncoder/TextDecoder polyfill for Hermes
  const textEncoding = require('fast-text-encoding');
  if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = textEncoding.TextEncoder;
    global.TextDecoder = textEncoding.TextDecoder;
  }
  // URL polyfill for React Native
  require('react-native-url-polyfill/auto');
}

// Suppress LogBox warnings in sandbox mode
LogBox.ignoreAllLogs(true);

// Load expo-router entry (registers as "main" for standalone use)
require('expo-router/entry');

// Also register as "default" for Appily sandbox compatibility
import { ExpoRoot } from 'expo-router';

function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

AppRegistry.registerComponent('default', () => App);
