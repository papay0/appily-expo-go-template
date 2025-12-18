import { Platform } from 'react-native';

// Only apply polyfills on native platforms (iOS/Android)
// Web and Node.js (bundler) already have these APIs
if (Platform.OS !== 'web') {
  // TextEncoder/TextDecoder polyfill for Hermes
  const textEncoding = require('fast-text-encoding');
  if (typeof global.TextEncoder === 'undefined') {
    (global as any).TextEncoder = textEncoding.TextEncoder;
    (global as any).TextDecoder = textEncoding.TextDecoder;
  }
  // URL polyfill for React Native
  require('react-native-url-polyfill/auto');
}

// Load expo-router entry
require('expo-router/entry');
