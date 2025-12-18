// Setup TextEncoder/TextDecoder polyfill first (required by URL polyfill)
import { TextEncoder, TextDecoder } from 'fast-text-encoding';
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

// Now load URL polyfill and expo-router
require('react-native-url-polyfill/auto');
require('expo-router/entry');
