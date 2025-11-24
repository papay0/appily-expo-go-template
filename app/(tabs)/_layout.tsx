import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        // Native iOS large title that collapses on scroll
        headerLargeTitle: true,
        headerTransparent: false,
        headerBlurEffect: colorScheme === 'dark' ? 'dark' : 'light',
        headerLargeTitleShadowVisible: false,

        // Other available header options you can use:
        // headerSearchBarOptions: { placeholder: 'Search...' }, // Native iOS search bar
        // headerRight: () => <Button title="Add" onPress={() => {}} />, // Right button
        // headerLeft: () => <Button title="Edit" onPress={() => {}} />, // Left button
        // headerBackVisible: false, // Hide back button
        // headerLargeStyle: { backgroundColor: 'red' }, // Style large title area
        // headerStyle: { backgroundColor: 'blue' }, // Style collapsed header
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gear" color={color} />,
        }}
      />
    </Tabs>
  );
}
