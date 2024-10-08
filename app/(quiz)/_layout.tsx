import { Stack } from "expo-router";
import { QuizDocsProvider } from "@/contexts/QuizContext";

export default function Quiz() {
  return (
    <QuizDocsProvider>
        <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="question1" options={{ headerShown: false }} />
        </Stack>
    </QuizDocsProvider>
  );
}
