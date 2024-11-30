import CustomDailyLog from "@/app/components/(tabs)/Goal Setting/custom_logs";
import Reflection from "@/app/components/(tabs)/Goal Setting/Reflection";
import SetGoalButton from "@/app/components/(tabs)/Goal Setting/SetGoalButton";
import React, { FC } from "react";
import { FlatList, View } from "react-native";
import { styled } from "nativewind";
import { Text, Layout, Card, useTheme } from "@ui-kitten/components";
import { myTheme } from "@/constants/custom-theme";
import WeekOverview from "@/app/components/(tabs)/Goal Setting/WeekOverview";
import DailyLog from "@/app/components/(tabs)/Home/DailyLog";
import AddActionButton from "@/app/components/(tabs)/Goal Setting/AddActionButton";
import ReflectionButton from "@/app/components/(tabs)/Goal Setting/ReflectionButton";
import { useLoadFonts } from "@/assets/fonts/loadFonts";
import ReflectionList from "@/app/components/(tabs)/Goal Setting/ReflectionList";

const Logs = () => {
  const data = [
    { id: "1", component: <DailyLog /> },
    { id: "2", component: <ReflectionList /> },
  ];

  const goalDates = {
    startDate: "10/20/2024",
    endDate: "11/05/2024",
  };

  const theme = useTheme();
  const fontsLoaded = useLoadFonts();

  const StyledText = styled(Text);
  const StyledLayout = styled(Layout);

  const Buttons: FC = () => {
    return (
        <View className="flex-row justify-start">
          <AddActionButton />
          <ReflectionButton />
        </View>
    )
  }

  return (
    <StyledLayout className="flex-1">
      <StyledLayout
        className="h-1/6 rounded-b-3xl justify-center items-center relative"
        style={{ backgroundColor: myTheme["color-success-700"] }}
      >
        <StyledText
          className="text-white text-2xl"
          style={{ fontFamily: "Poppins-SemiBold" }}
        >
          Daily Log
        </StyledText>
      </StyledLayout>

      <StyledLayout className="flex-1 px-2">
        <WeekOverview />

        <View className="flex-1">
          <FlatList
            data={[
              { id: "1", component: <DailyLog /> },
              { id: "2", component: <Buttons /> },
              { id: "3", component: <ReflectionList /> },
            ]}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="mb-4">{item.component}</View>
            )}
            showsVerticalScrollIndicator={false}
          />
          
        </View>
      </StyledLayout>
    </StyledLayout>
  );
};

export default Logs;
