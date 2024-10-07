import { Stack } from "expo-router";
import RootLayout from '../_layout';

export default function Quiz() {
    return (
        <Stack>
            <Stack.Screen name="question1" options={{headerShown: false}}/>
            <Stack.Screen name="index" options={{headerShown: false}}/>
        </Stack>
    )
}