import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native'

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarInactiveTintColor: 'gray',
        tabBarActiveTintColor: 'green',
        headerShown: false,
        tabBarStyle: {
          position: 'absolute'
        },
        tabBarLabelStyle: {
          marginTop: -5, 
          fontSize: 11, 
          marginBottom: 3,
        },
      }}>
        <Tabs.Screen
          name="Home/index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TabBarIcon 
                name={focused ? 'home' : 'home-outline'} 
                color={color} 
              />
              </View>
            ),
            headerShown: false
          }}
        />
        <Tabs.Screen
          name="Eco Articles/list"
          options={{
            title: 'Articles',
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TabBarIcon 
                name={focused ? 'book' : 'book-outline'} 
                color={color} 
              />
              </View>
            ),
            headerShown: false
          }}
        />
        <Tabs.Screen
          name="Goal Setting/logs"
          options={{
            title: 'Actions',
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TabBarIcon 
                name={focused ? 'checkmark-done' : 'checkmark-done-outline'} 
                color={color} 
              />
              </View>
            ),
            headerShown: false
          }}
        />
        <Tabs.Screen
          name="Progress Monitoring/report"
          options={{
            title: 'Progress',
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',

              }}>
              <TabBarIcon 
                name={focused ? 'bar-chart' : 'bar-chart-outline'} 
                color={color} 
              />
              </View>
            ),
            headerShown: false
          }}
        />
        <Tabs.Screen
          name="Community/Feed"
          options={{
            title: 'Community',
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TabBarIcon 
                name={focused ? 'people' : 'people-outline'} 
                color={color} 
              />
              </View>
            ),
            headerShown: false
          }}
        />
        <Tabs.Screen
          name="Rewards/points"
          options={{
            title: 'Rewards',
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TabBarIcon 
                name={focused ? 'star' : 'star-outline'} 
                color={color} 
              />
              </View>
            ),
            headerShown: false
          }}
        />
      </Tabs>
  );
}
