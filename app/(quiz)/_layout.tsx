import { Stack } from "expo-router";
import { QuizDocsProvider } from "@/contexts/QuizContext";
import { EmissionsProvider } from "@/contexts/EmissionsContext";
import Calculator from "../components/quiz/Calculator";
import { SafeAreaView, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

function QuizHeader() {
  const navigation = useNavigation();

  return (
    <View className="h-1/8 bg-white border-b border-stone-300 flex-row pl-5">
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={35} color="#78716C" 
          style={{ flex: 1, alignItems: 'center', paddingTop: 20, paddingRight: 15 }}
        />
      </TouchableOpacity>

      <View className="pt-2"><Calculator /></View>

      {/* 'as never' to avoid error temporarily */}
      <TouchableOpacity onPress={() => navigation.navigate('components/quiz/ListScreen' as never)}>
        <Ionicons name='list' size={35} color="#78716C" 
          style={{alignItems: 'center', paddingTop: 20, paddingLeft: 172}}
        />
      </TouchableOpacity>
    </View>
  );
}

function Quiz() {
  return (
    <SafeAreaView className="flex-1 pt-10">
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: true,
            header: () => <QuizHeader />,
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}

export default function QuizLayout() {
  return (
    <EmissionsProvider>
      <QuizDocsProvider>
        <Quiz />
      </QuizDocsProvider>
    </EmissionsProvider>
  );
}
