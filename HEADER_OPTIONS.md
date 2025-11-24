# iOS Native Header Options

This template uses **real native iOS headers** via Expo Router and React Navigation. Here are all the available options:

## Basic Header Options

```tsx
<Stack.Screen
  name="screen"
  options={{
    // Title configuration
    title: 'My Screen',
    headerLargeTitle: true, // iOS large title that collapses on scroll

    // Visibility
    headerShown: true,
    headerTransparent: false,
    headerBackVisible: true,

    // Styling
    headerBlurEffect: 'light' | 'dark', // Native iOS blur
    headerLargeTitleShadowVisible: false,
    headerTintColor: '#007AFF', // Button and icon color
  }}
/>
```

## Search Bar

Add a native iOS search bar in the header:

```tsx
options={{
  headerSearchBarOptions: {
    placeholder: 'Search...',
    onChangeText: (event) => {
      const text = event.nativeEvent.text;
      // Handle search
    },
  },
}}
```

## Header Buttons

Add buttons to the header:

```tsx
import { Pressable, Text } from 'react-native';

options={{
  headerRight: () => (
    <Pressable onPress={() => console.log('Add pressed')}>
      <Text style={{ color: '#007AFF', fontSize: 17 }}>Add</Text>
    </Pressable>
  ),
  headerLeft: () => (
    <Pressable onPress={() => console.log('Edit pressed')}>
      <Text style={{ color: '#007AFF', fontSize: 17 }}>Edit</Text>
    </Pressable>
  ),
}}
```

## Advanced Styling

```tsx
options={{
  // Style the large title area
  headerLargeStyle: {
    backgroundColor: '#F2F2F7',
  },

  // Style the collapsed header
  headerStyle: {
    backgroundColor: '#FFFFFF',
  },

  // Title text style
  headerTitleStyle: {
    fontWeight: '600',
  },

  // Large title text style
  headerLargeTitleStyle: {
    fontWeight: '700',
  },
}}
```

## Per-Screen Customization

You can override global settings per screen:

```tsx
<Tabs.Screen
  name="home"
  options={{
    title: 'Home',
    headerLargeTitle: true, // This screen has large title
  }}
/>
<Tabs.Screen
  name="detail"
  options={{
    title: 'Detail',
    headerLargeTitle: false, // This screen doesn't
  }}
/>
```

## Common Patterns

### Settings Screen Style
```tsx
options={{
  title: 'Settings',
  headerLargeTitle: true,
  headerBlurEffect: colorScheme === 'dark' ? 'dark' : 'light',
}}
```

### Detail Screen with Back Button
```tsx
options={{
  title: 'Details',
  headerLargeTitle: false, // Smaller header for detail screens
  headerBackTitle: 'Back',
}}
```

### Modal Screen
```tsx
options={{
  presentation: 'modal',
  title: 'Modal',
  headerLargeTitle: false,
}}
```
