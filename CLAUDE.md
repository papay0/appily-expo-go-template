# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Expo React Native application template designed for iOS-first development with native iOS design patterns. The project uses:
- **Expo SDK 54** with React 19 and React Native 0.81
- **Expo Router** for file-based navigation with typed routes
- **New Architecture** enabled (React Compiler + bridgeless mode)
- **iOS-native design system** with large titles, SF Symbols, and table views

## Commands

### Development
```bash
npm start               # Start Expo development server
npm run ios             # Start on iOS simulator
npm run android         # Start on Android emulator
npm run web             # Start web version
npm run lint            # Run ESLint
npm run reset-project   # Move starter code to app-example/ and create blank app/
```

Note: User prefers to run `npm run dev` themselves, so do not start the dev server unless asked.

## Architecture

### Routing (expo-router)
- File-based routing with `app/` directory
- `app/_layout.tsx`: Root layout with Stack navigation and ThemeProvider
- `app/(tabs)/_layout.tsx`: Tab navigator with iOS large title headers
- `app/(tabs)/index.tsx`: Home screen (first tab)
- `app/(tabs)/explore.tsx`: Settings screen (second tab)
- `app/modal.tsx`: Modal screen example
- Typed routes enabled via `experiments.typedRoutes`

### Theme System
- `constants/theme.ts`: Centralized color and font definitions
- `Colors` object with `light` and `dark` modes matching iOS system colors
- `Fonts` object with platform-specific font families (iOS, web, default)
- Colors follow iOS design guidelines (system grouped backgrounds, separators, etc.)

### Component Pattern
All themed components follow this pattern:
1. Accept optional `lightColor` and `darkColor` props for color overrides
2. Use `useThemeColor()` hook to resolve colors from theme
3. Use `useColorScheme()` hook to access current color scheme
4. Located in `components/` directory

Key components:
- `ThemedView`: Background-aware container
- `ThemedText`: Text with theme colors and variants
- `TableViewGroup` & `TableViewCell`: iOS-style grouped table views
- `IconSymbol`: Platform-specific icon wrapper (uses expo-symbols on iOS)
- `HapticTab`: Tab bar button with haptic feedback

### Hooks
- `use-color-scheme.ts`: Returns current color scheme, has platform-specific variants (`.web.ts`)
- `use-theme-color.ts`: Resolves theme colors with optional overrides

### Path Aliases
- `@/` maps to the project root
- Example: `import { Colors } from '@/constants/theme'`

### iOS-Native Features
The tab layout (`app/(tabs)/_layout.tsx`) is configured with iOS-native header options:
- `headerLargeTitle: true` - Native iOS large titles that collapse on scroll
- `headerBlurEffect` - Native blur backgrounds
- Additional options available (see comments): `headerSearchBarOptions`, `headerRight`, `headerLeft`

### Platform-Specific Files
- `.ios.tsx` and `.tsx` variants for components (e.g., `icon-symbol.ios.tsx` uses expo-symbols, fallback uses Ionicons)
- `.web.ts` variants for hooks when web needs different implementation

## Configuration Files

### app.json
- Expo config with `newArchEnabled: true` (React Compiler + New Architecture)
- iOS: supports tablet, predictive back gesture disabled
- Android: edge-to-edge enabled, adaptive icon configured
- Typed routes and React Compiler experimental features enabled

### tsconfig.json
- Strict mode enabled
- Path alias `@/*` configured
- Extends `expo/tsconfig.base`

### eslint.config.js
- Uses Expo's flat config
- Ignores `dist/` directory

## Development Notes

- **Do not run build** (`npm run build` doesn't exist) unless explicitly requested
- The template focuses on iOS-first design with native patterns
- Use SF Symbols on iOS via `expo-symbols` (IconSymbol component)
- All screens use `contentInsetAdjustmentBehavior="automatic"` for proper safe area handling
- Color scheme automatically switches between light/dark based on system settings
