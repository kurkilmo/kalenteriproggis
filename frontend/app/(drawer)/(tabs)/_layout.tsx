import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t, i18n } = useTranslation();

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
          title: t('tabs.my-calendar'),
          tabBarIcon: ({ color }) => <EvilIcons name="calendar" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="(organizations)"
        options={{
          title: t('tabs.organizations'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
      name="(groups)"
      options={{
        title: t('tabs.my-groups'),
        tabBarIcon: ({ color }) => <MaterialIcons name="groups" size={24} color="black" />,
      }}
      />
    </Tabs>
  );
}
