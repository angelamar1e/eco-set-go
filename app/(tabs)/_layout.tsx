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
        tabBarActiveTintColor: 'white',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'black',
          borderRadius: 35,         
          height: 65, 
          marginBottom: 5,
          marginHorizontal:20,
          position: 'absolute'
        },
      }}>
        <Tabs.Screen
          name="Home/index"
          options={{
            title: '',
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 55,
                width: 55,
                marginTop: 10
              }}>
                <View style={{
                  borderRadius: 25,
                  backgroundColor: focused ? '#4A8B2A' : 'transparent',
                  padding: focused ? 10 : 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <TabBarIcon 
                    name={focused ? 'home' : 'home-outline'} 
                    color={color} 
                    style={{ fontSize: 35 }}
                  />
                </View>
              </View>
            ),
            headerShown: false
          }}
        />
        <Tabs.Screen
          name="Eco Articles/list"
          options={{
            title: '',
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 55,
                width: 55,
                marginTop: 10
              }}>
                <View style={{
                  borderRadius: 25,
                  backgroundColor: focused ? '#4A8B2A' : 'transparent',
                  padding: focused ? 10 : 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <TabBarIcon 
                    name={focused ? 'book' : 'book-outline'} 
                    color={color} 
                    style={{ fontSize: 35 }}
                  />
                </View>
              </View>
            ),
            headerShown: false
          }}
        />
        <Tabs.Screen
          name="Goal Setting/logs"
          options={{
            title: '',
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 55,
                width: 55,
                marginTop: 10
              }}>
                <View style={{
                  borderRadius: 25,
                  backgroundColor: focused ? '#4A8B2A' : 'transparent',
                  padding: focused ? 10 : 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <TabBarIcon 
                    name={focused ? 'checkmark-done' : 'checkmark-done-outline'} 
                    color={color} 
                    style={{ fontSize: 35 }}
                  />
                </View>
              </View>
            ),
            headerShown: false
          }}
        />
        <Tabs.Screen
          name="Progress Monitoring/report"
          options={{
            title: '',
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 55,
                width: 55,
                marginTop: 10
              }}>
                <View style={{
                  borderRadius: 25,
                  backgroundColor: focused ? '#4A8B2A' : 'transparent',
                  padding: focused ? 10 : 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <TabBarIcon 
                    name={focused ? 'bar-chart' : 'bar-chart-outline'} 
                    color={color} 
                    style={{ fontSize: 35 }}
                  />
                </View>
              </View>
            ),
            headerShown: false
          }}
        />
        <Tabs.Screen
          name="Community/Feed"
          options={{
            title: '',
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 55,
                width: 55,
                marginTop: 10
              }}>
                <View style={{
                  borderRadius: 25,
                  backgroundColor: focused ? '#4A8B2A' : 'transparent',
                  padding: focused ? 10 : 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <TabBarIcon 
                    name={focused ? 'people' : 'people-outline'} 
                    color={color} 
                    style={{ fontSize: 35 }}
                  />
                </View>
              </View>
            ),
            headerShown: false
          }}
        />
        <Tabs.Screen
          name="Rewards/points"
          options={{
            title: '',
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 55,
                width: 55,
                marginTop: 10
              }}>
                <View style={{
                  borderRadius: 25,
                  backgroundColor: focused ? '#4A8B2A' : 'transparent',
                  padding: focused ? 10 : 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <TabBarIcon 
                    name={focused ? 'star' : 'star-outline'} 
                    color={color} 
                    style={{ fontSize: 35 }}
                  />
                </View>
              </View>
            ),
            headerShown: false
          }}
        />
      </Tabs>
  );
}
