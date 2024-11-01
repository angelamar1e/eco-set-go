import { Stack } from "expo-router";
import { QuizDocsProvider } from "@/contexts/QuizContext";
import { EmissionsProvider } from "@/contexts/Emissions";
import Calculator from "../components/quiz/Calculator";
import { SafeAreaView, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useTheme, Layout, TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import { Ionicons } from '@expo/vector-icons'; 
import { myTheme } from "@/constants/custom-theme";

const QuizHeader = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const navigateBack = () => navigation.goBack();
  const navigateToList = () => navigation.navigate('components/quiz/ListScreen' as never);

  const BackIcon = () => <Ionicons name="chevron-back-outline" size={25} color={theme['color-success-900']} />;
  const ListIcon = () => <Ionicons name="list-outline" size={28} color={theme['color-success-900']} />;

  return (
    <Layout level='1' style={{ borderBottomWidth: 2, borderBottomColor: myTheme["color-success-900"], borderStyle: 'solid' }}>
      <TopNavigation
        accessoryLeft={() => (
          <View className='flex-row items-center'>
            <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
            <Calculator />
          </View> 
        )}
        accessoryRight={() => (
          <TopNavigationAction icon={ListIcon} onPress={navigateToList} />
        )}
      />
    </Layout>
  );
};

const Quiz = () => (
  <SafeAreaView className="flex-1 pt-10">
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          header: () => <QuizHeader />,
        }}
      />
      <Stack.Screen
        name="QuizEnd"
        options={{
          headerShown: true,
          header: () => <QuizHeader />,
        }}
      />
    </Stack>
  </SafeAreaView>
);

export default function QuizLayout() {
  return (
    <EmissionsProvider>
      <QuizDocsProvider>
        <Quiz />
      </QuizDocsProvider>
    </EmissionsProvider>
  );
}
