import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@ui-kitten/components';
import LandingPage from './Home';
import EcoActionsList from './Eco Articles/list';
import CombinedReport from './Progress Monitoring/report';
import GoalSetting from './Goal Setting/logs';
import Feed from './Community/Feed';
import EcoPoints from './Rewards/points';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

const { Navigator, Screen } = createBottomTabNavigator();

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Navigator
      screenOptions={{
        tabBarInactiveTintColor: theme['color-basic-600'],
        tabBarActiveTintColor: theme['color-success-500'],
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: theme['background-basic-color-1'],
        },
        tabBarLabelStyle: {
          marginTop: -5,
          fontSize: 11,
          marginBottom: 3,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Screen
        name="Home/index"
        component={LandingPage}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Screen
        name="Eco Articles/list"
        component={EcoActionsList}
        options={{
          title: 'Articles',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'book' : 'book-outline'} color={color} />
          ),
        }}
      />
      <Screen
        name="Goal Setting/logs"
        component={GoalSetting}
        options={{
          title: 'Actions',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'checkmark-done' : 'checkmark-done-outline'} color={color} />
          ),
        }}
      />
      <Screen
        name="Progress Monitoring/report"
        component={CombinedReport}
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'bar-chart' : 'bar-chart-outline'} color={color} />
          ),
        }}
      />
      <Screen
        name="Community/feed"
        component={Feed}
        options={{
          title: 'Community',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'people' : 'people-outline'} color={color} />
          ),
        }}
      />
      <Screen
        name="Rewards/points"
        component={EcoPoints}
        options={{
          title: 'Rewards',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'star' : 'star-outline'} color={color} />
          ),
        }}
      />

    </Navigator>
  );
}
