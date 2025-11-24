/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#007AFF'; // iOS blue
const tintColorDark = '#0A84FF'; // iOS dark mode blue

export const Colors = {
  light: {
    text: '#000000',
    secondaryText: '#3C3C43',
    tertiaryText: '#3C3C4399',
    background: '#F2F2F7', // iOS system grouped background
    secondaryBackground: '#FFFFFF', // iOS secondary grouped background
    tertiaryBackground: '#F2F2F7',
    tint: tintColorLight,
    icon: '#3C3C43',
    tabIconDefault: '#3C3C43',
    tabIconSelected: tintColorLight,
    separator: '#3C3C4329', // iOS separator
    border: '#3C3C4336',
  },
  dark: {
    text: '#FFFFFF',
    secondaryText: '#EBEBF5',
    tertiaryText: '#EBEBF599',
    background: '#000000', // iOS dark system grouped background
    secondaryBackground: '#1C1C1E', // iOS dark secondary grouped background
    tertiaryBackground: '#2C2C2E',
    tint: tintColorDark,
    icon: '#EBEBF5',
    tabIconDefault: '#EBEBF5',
    tabIconSelected: tintColorDark,
    separator: '#54545899', // iOS dark separator
    border: '#54545836',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
