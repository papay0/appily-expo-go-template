# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Expo React Native application template designed for iOS-first development with modern UI components. The project uses:
- **Expo SDK 54** with React 19 and React Native 0.81
- **Expo Router** for file-based navigation with typed routes
- **New Architecture** enabled (React Compiler + bridgeless mode)
- **React Native Reusables** - Beautiful UI components based on shadcn/ui
- **NativeWind** - Tailwind CSS for React Native
- **Lucide Icons** - Beautiful & consistent icons
- **Expo Go Compatible** - Works with Expo Go without native builds

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
- `app/_layout.tsx`: Root layout with Stack navigation, ThemeProvider, and PortalHost
- `app/(tabs)/_layout.tsx`: Tab navigator with iOS large title headers
- `app/(tabs)/index.tsx`: Home screen with "Building Your App" template
- `app/(tabs)/explore.tsx`: Settings screen
- `app/modal.tsx`: Modal screen example
- Typed routes enabled via `experiments.typedRoutes`

### UI Components (React Native Reusables)
Located in `components/ui/`:
- **Layout**: `Card`, `Separator`, `Skeleton`, `AspectRatio`
- **Forms**: `Button`, `Input`, `Textarea`, `Label`, `Checkbox`, `Radio`, `Switch`, `Select`
- **Feedback**: `Alert`, `AlertDialog`, `Dialog`, `Progress`, `Badge`
- **Navigation**: `Tabs`, `Menubar`, `DropdownMenu`, `ContextMenu`
- **Overlay**: `Popover`, `Tooltip`, `HoverCard`
- **Typography**: `Text` (with variants: h1-h4, p, muted, lead, etc.)
- **Data**: `Accordion`, `Collapsible`, `Avatar`
- **Utility**: `Toggle`, `ToggleGroup`, `Icon`

### Theme System
Two theme systems coexist:
1. **NativeWind/CSS Variables** (primary for new components):
   - `global.css`: CSS variables for colors
   - `tailwind.config.js`: Tailwind configuration
   - `lib/theme.ts`: Navigation theme using CSS variable colors

2. **Legacy Theme** (for existing iOS components):
   - `constants/theme.ts`: Colors and Fonts objects
   - Used by `ThemedView`, `ThemedText`, `TableViewGroup`, etc.

### Key Files
- `babel.config.js`: Babel preset with NativeWind
- `metro.config.js`: Metro config with NativeWind
- `tailwind.config.js`: Tailwind CSS configuration
- `global.css`: CSS variables for theming
- `components.json`: shadcn/ui component configuration
- `lib/utils.ts`: `cn()` utility for class merging
- `lib/theme.ts`: Navigation theme configuration

### Icons
Two icon systems available:
1. **Lucide Icons** (recommended for new components):
   ```tsx
   import { Icon } from '@/components/ui/icon';
   import { Rocket } from 'lucide-react-native';
   <Icon as={Rocket} size={24} className="text-primary" />
   ```

2. **IconSymbol** (for iOS SF Symbols):
   ```tsx
   import { IconSymbol } from '@/components/ui/icon-symbol';
   <IconSymbol name="house.fill" size={28} color={color} />
   ```

### Path Aliases
- `@/` maps to the project root
- Example: `import { Button } from '@/components/ui/button'`

### Styling
Use NativeWind (Tailwind) classes:
```tsx
<View className="flex-1 bg-background p-6">
  <Text className="text-foreground font-semibold">Hello</Text>
  <Button variant="outline" size="lg">
    <Text>Click me</Text>
  </Button>
</View>
```

Available color utilities:
- `bg-background`, `text-foreground` - Main colors
- `bg-primary`, `text-primary-foreground` - Primary brand
- `bg-secondary`, `text-secondary-foreground` - Secondary
- `bg-muted`, `text-muted-foreground` - Muted/subtle
- `bg-accent`, `text-accent-foreground` - Accent
- `bg-destructive` - Destructive/error
- `bg-card`, `text-card-foreground` - Card backgrounds
- `border-border`, `border-input` - Borders

## Adding New Components

Use the React Native Reusables CLI:
```bash
npx @react-native-reusables/cli@latest add button
npx @react-native-reusables/cli@latest add -a  # Add all components
npx @react-native-reusables/cli@latest doctor  # Check setup
```

## Configuration Files

### app.json
- Expo config with `newArchEnabled: true`
- Web bundler set to `metro` for NativeWind support
- iOS: supports tablet
- Android: edge-to-edge enabled

### tsconfig.json
- Strict mode enabled
- Path alias `@/*` configured
- NativeWind types via `nativewind-env.d.ts`

## Development Notes

- **Expo Go Compatible**: All dependencies work with Expo Go
- **Do not run build** unless explicitly requested
- Use `className` for styling with NativeWind
- Use the `Text` component from `@/components/ui/text` for proper styling context
- Dark mode is automatic based on system settings
- `PortalHost` is required in root layout for overlays (Dialog, Popover, etc.)
