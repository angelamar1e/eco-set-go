import CustomDailyLog from "@/app/components/(tabs)/Goal Setting/custom_logs";
import Reflection from "@/app/components/(tabs)/Goal Setting/Reflection";
import SetGoalButton from "@/app/components/(tabs)/Goal Setting/SetGoalButton";
import React from "react";
import { FlatList, View } from "react-native";
import { styled } from 'nativewind';
import { Text, Layout, Card, useTheme } from "@ui-kitten/components";
import { myTheme } from "@/constants/custom-theme";
import WeekOverview from "@/app/components/(tabs)/Goal Setting/WeekOverview";
import DailyLog from "@/app/components/(tabs)/Home/DailyLog";
import AddActionButton from "@/app/components/(tabs)/Goal Setting/AddActionButton";
import ReflectionButton from "@/app/components/(tabs)/Goal Setting/ReflectionButton";
import { useLoadFonts } from "@/assets/fonts/loadFonts";
import ReflectionList from "@/app/components/(tabs)/Goal Setting/ReflectionList";

const GoalSetting = () => {
    const theme = useTheme();
    const fontsLoaded = useLoadFonts(); 

    const StyledText = styled(Text);
    const StyledLayout = styled(Layout);
    
    return (
        <StyledLayout className="flex-1">
            <StyledLayout className='h-1/6 rounded-b-3xl justify-center items-center relative'
                style={{ backgroundColor: myTheme['color-success-700'] }}>
                <StyledText className="text-white text-3xl" style={{ fontFamily: 'Poppins-SemiBold'}}>Daily Log</StyledText>
            </StyledLayout>

            <StyledLayout className="flex-1 px-2">
                <WeekOverview />
                <View className="flex-row m-1 items-center justify-between">
                    <Text style={{ fontSize: 40, marginLeft: 10 }}>🌞💭</Text>
                    <View className="flex-row items-center">
                        <AddActionButton />
                        <ReflectionButton />
                    </View>
                </View>

                <View className="flex-1">
                    <FlatList
                        data={[{ id: '1', component: <DailyLog /> }, { id: '2', component: <ReflectionList /> }]}
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

export default GoalSetting;
