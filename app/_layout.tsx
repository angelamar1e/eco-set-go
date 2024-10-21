import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import { EmissionsProvider } from "@/contexts/EmissionsContext";
import { myTheme } from "@/constants/custom-theme";

export default function RootLayout() {
  
  return (
    <EmissionsProvider>
    <ApplicationProvider {...eva} theme={{...eva.dark, ...myTheme}}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="index" options={{headerShown: false}}/>
          <Stack.Screen name="login" options={{headerShown: false}}/>
          <Stack.Screen name="sign_up" options={{headerShown: false}}/>
          <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
        </Stack>
      </GestureHandlerRootView>
    </ApplicationProvider>
    </EmissionsProvider>
    );
}
