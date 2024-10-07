import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "./components/AuthContext";

export default function RootLayout() {
  
  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="index" options={{headerShown: false}}/>
          <Stack.Screen name="login" options={{headerShown: false}}/>
          <Stack.Screen name="sign_up" options={{headerShown: false}}/>
          <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
        </Stack>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}
