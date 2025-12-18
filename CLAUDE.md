# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Note for AI Agents:** This is a template app. Feel free to modify, remove, or replace any code including the settings screen, header icons, navigation structure, etc. The patterns shown here are examples to follow, not requirements to keep.

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
- `app/index.tsx`: Home screen (default route)
- `app/settings.tsx`: Settings screen with dark mode toggle
- `app/modal.tsx`: Modal screen example
- Typed routes enabled via `experiments.typedRoutes`

### Theme System (Dark/Light Mode)

This project has a complete dark/light mode system. AI agents should use these patterns:

#### Using Theme Colors
```tsx
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

const colorScheme = useColorScheme();
const colors = Colors[colorScheme ?? 'light'];
// Access: colors.text, colors.background, colors.tint, colors.secondaryText, etc.
```

#### Themed Components
- `ThemedView` - Use instead of View for themed backgrounds
- `ThemedText` - Use instead of Text for themed text colors

#### Theme Toggle Example
See `app/settings.tsx` for a complete dark mode toggle implementation using:
```tsx
import { Appearance } from 'react-native';
Appearance.setColorScheme('dark' | 'light');
```

#### Header Navigation Pattern (Template Example)
The settings icon in `app/_layout.tsx` is just a template example. **AI agents should feel free to remove or modify it** based on the app's needs:
```tsx
<Stack.Screen
  name="index"
  options={{
    headerRight: () => (
      <Link href="/settings" asChild>
        <Pressable>
          <IconSymbol name="gearshape" size={24} color={colors.tint} />
        </Pressable>
      </Link>
    ),
    // Remove headerRight entirely if not needed
  }}
/>
```

### Color Definitions
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

### Hooks
- `use-color-scheme.ts`: Returns current color scheme, has platform-specific variants (`.web.ts`)
- `use-theme-color.ts`: Resolves theme colors with optional overrides

### Path Aliases
- `@/` maps to the project root
- Example: `import { Colors } from '@/constants/theme'`

### iOS-Native Features
The root layout (`app/_layout.tsx`) is configured with iOS-native header options:
- `headerLargeTitle: true` - Native iOS large titles that collapse on scroll
- Additional options available: `headerSearchBarOptions`, `headerRight`, `headerLeft`, `headerBlurEffect`

#### Disabling Large Titles (Smaller Header)
If your app needs more screen space, disable large titles in `app/_layout.tsx`:
```tsx
<Stack.Screen
  name="index"
  options={{
    title: 'My App',
    headerLargeTitle: false,  // Use standard smaller header
  }}
/>
```

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

## Pre-installed Packages

### Convex (Already Installed!)
**DO NOT run `npx expo install convex` or `npm install convex`** - Convex is already in package.json.
Just start using Convex imports directly:
```typescript
// In React Native components:
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
```

Deploy Convex functions with:
```bash
npm run convex:deploy
```

## Development Notes

- **Do not run build** (`npm run build` doesn't exist) unless explicitly requested
- The template focuses on iOS-first design with native patterns
- Use SF Symbols on iOS via `expo-symbols` (IconSymbol component)
- Color scheme automatically switches between light/dark based on system settings

### SafeArea Handling
The app is wrapped with `SafeAreaProvider` in `app/_layout.tsx`. This enables proper safe area handling throughout the app.

For screens that need safe area insets (e.g., custom headers), use:
```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const insets = useSafeAreaInsets();
// Use insets.top, insets.bottom, insets.left, insets.right
```

### ScrollView Requirement (Important!)
**Always wrap screen content in a ScrollView** to ensure proper scrolling and safe area handling:
```tsx
<ThemedView style={{ flex: 1 }}>
  <ScrollView
    style={{ flex: 1 }}
    contentContainerStyle={{ flexGrow: 1, padding: 16 }}
    contentInsetAdjustmentBehavior="automatic"
  >
    {/* Your content here */}
  </ScrollView>
</ThemedView>
```
- `contentInsetAdjustmentBehavior="automatic"` handles iOS safe areas and header insets
- `flexGrow: 1` on contentContainerStyle allows centering content in shorter screens
- Without ScrollView, content may appear under the header or be cut off

### Keyboard Handling for Forms (CRITICAL!)

Any screen with TextInput fields **MUST** handle keyboard properly to avoid these common bugs:
1. Input hidden behind keyboard
2. Can't tap submit button when keyboard is open
3. Keyboard won't dismiss when tapping outside
4. Layout jumps/glitches when keyboard opens

**See the complete example at:** `examples/form-pattern.tsx`

**Quick Reference Pattern:**
```tsx
import { useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

function FormScreen() {
  const nextFieldRef = useRef<TextInput>(null);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            returnKeyType="next"
            onSubmitEditing={() => nextFieldRef.current?.focus()}
            blurOnSubmit={false}
          />
          <TextInput
            ref={nextFieldRef}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
```

**Key Requirements:**
- `KeyboardAvoidingView` wraps the form content
- **iOS:** `behavior="padding"` + `keyboardVerticalOffset` (header height ~100)
- **Android:** `behavior={undefined}` - Android handles this automatically
- `TouchableWithoutFeedback` with `Keyboard.dismiss()` to dismiss on tap outside
- `keyboardShouldPersistTaps="handled"` so buttons work while keyboard is open
- `returnKeyType` + `onSubmitEditing` for field navigation

**Themed TextInput Component:**
Use the `ThemedTextInput` component from `components/ui/themed-text-input.tsx` for consistent styling:
```tsx
import { ThemedTextInput } from '@/components/ui/themed-text-input';

<ThemedTextInput
  label="Email"
  placeholder="you@example.com"
  keyboardType="email-address"
  error={emailError}
/>
```
