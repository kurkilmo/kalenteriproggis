import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName='(home)'
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      {/** Oletuspolku tabille. Uudelleenohjaa kotisivulle */}
      <Tabs.Screen
      name="index"
      options={{
        title: 'index',
        tabBarItemStyle: { display: "none" },
      }}
      />
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Oma Kalenteri',
          tabBarIcon: ({ color }) => <EvilIcons name="calendar" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="(organizations)"
        options={{
          title: 'Organisaatiot',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
      name="(groups)"
      options={{
        title: 'Omat ryhmät',
        tabBarIcon: ({ color }) => <MaterialIcons name="groups" size={24} color="black" />,
      }}
      />
    </Tabs>
  );
}
