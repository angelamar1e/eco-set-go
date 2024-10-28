import React from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, Layout } from "@ui-kitten/components";
// import { EmissionsProvider } from "@/contexts/EmissionsContext";
import { myTheme } from "@/constants/custom-theme";
import { useColorScheme } from "react-native";

export default function ProfileLayout() {
  const colorScheme = useColorScheme();

  return (
    // <EmissionsProvider>
      <ApplicationProvider
        {...eva}
        theme={colorScheme === "dark" ? { ...eva.dark, ...myTheme } : { ...eva.light, ...myTheme.light }}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Layout style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="profile" options={{ headerShown: false }} />
              <Stack.Screen name="Settings/setting" options={{ headerShown: false}} />
            </Stack>
          </Layout>
        </GestureHandlerRootView>
      </ApplicationProvider>
  );
}
