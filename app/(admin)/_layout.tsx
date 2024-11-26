import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';


const EmptyHeader = () => {
  return (
    <></>
  )
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
          headerShown: true,
          header: () => <EmptyHeader/>
        }}
      />
      <Tabs.Screen
        name="Eco Articles/list"
        options={{
          title: 'Eco Articles',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'book' : 'book-outline'} color={color} />
          ),
          headerShown: true,
          header: () => <EmptyHeader/>
        }}
      />
</Tabs>
  );
}
