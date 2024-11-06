import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, Layout, Text } from "@ui-kitten/components";
import { EmissionsProvider } from "@/contexts/Emissions";
import { myTheme } from "@/constants/custom-theme";
import { useColorScheme } from "react-native";
import { EmissionsDataProvider } from "@/contexts/EmissionsData";
import { UserProvider } from "@/contexts/UserContext";
import { UserLogsProvider } from "@/contexts/UserLogs";
import { UserGoalProvider } from "@/contexts/UserGoalContext";
import { EcoActionsProvider } from "@/contexts/EcoActions";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <UserProvider>
      <EcoActionsProvider>
        <EmissionsProvider>
          <EmissionsDataProvider>
            <UserLogsProvider>
              <UserGoalProvider>
                <ApplicationProvider
                  {...eva}
                  theme={
                    colorScheme === "dark"
                      ? { ...eva.dark, ...myTheme }
                      : { ...eva.light, ...myTheme.light }
                  }
                >
                  <GestureHandlerRootView style={{ flex: 1 }}>
                    <Stack>
                      <Stack.Screen
                        name="index"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="login"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="sign_up"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="(quiz)"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="components/quiz/ListScreen"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="Profile"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="components/(tabs)/Eco Articles/[article]"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen 
                        name="components/(tabs)/Settings/UpdateUsername" 
                        options={{ headerShown: false}} 
                      />
                      <Stack.Screen 
                        name="components/(tabs)/Settings/updatepassword" 
                        options={{ headerShown: false}} 
                      />
                      <Stack.Screen 
                        name="components/(tabs)/Settings/updateemail" 
                        options={{ headerShown: false}} 
                      />
                      <Stack.Screen 
                        name="components/(tabs)/Eco Articles/Introduction" 
                        options={{headerShown: false}}
                      />              
                    </Stack>     
                  </GestureHandlerRootView>
                </ApplicationProvider>
              </UserGoalProvider>
            </UserLogsProvider>
          </EmissionsDataProvider>
        </EmissionsProvider>
      </EcoActionsProvider>
    </UserProvider>
  );
}
