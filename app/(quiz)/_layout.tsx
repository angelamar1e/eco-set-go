import { Stack } from "expo-router";
import { QuizDocsProvider } from "@/contexts/QuizContext";
import { EmissionsProvider } from "@/contexts/EmissionsContext";
import Calculator from "../components/quiz/Calculator";
import { SafeAreaView, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

function CustomHeader() {
  const navigation = useNavigation();

  return (
    <View className="h-1/8 bg-white border-b border-stone-300 flex-row pl-5">
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={35} color="#78716C" 
          style={{ flex: 1, alignItems: 'center', paddingTop: 20, paddingRight: 15 }}
        />
      </TouchableOpacity>
      <View className="pt-2">
        <Calculator />
      </View>
    </View>
  );
}

export default function Quiz() {
  return (
    <EmissionsProvider>
      <QuizDocsProvider>
        <SafeAreaView className="flex-1 pt-10">
          <Stack>
            <Stack.Screen 
              name="index" 
              options={{
                headerShown: true,
                header: () => <CustomHeader />,
              }} 
            />
          </Stack>
        </SafeAreaView>
      </QuizDocsProvider>
    </EmissionsProvider>
  );
}
