import { Stack } from "expo-router";
import { QuizDocsProvider } from "@/contexts/QuizContext";
import {EmissionsProvider } from "@/contexts/EmissionsContext";

export default function Quiz() {
  return (
    <EmissionsProvider>
      <QuizDocsProvider>
          <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="Transportation1" options={{ headerShown: false }} />
          </Stack>
      </QuizDocsProvider>
    </EmissionsProvider>
  );
}
