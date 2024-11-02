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

const Logs = () => {
    const data = [
        { id: '1', component: <DailyLog /> },
        { id: '2', component: <Reflection /> },
    ];

    const goalDates = {
        startDate: '10/20/2024',
        endDate: '11/05/2024',
    };

    const theme = useTheme();

    const subtextColor1 = theme['color-basic-600']; 
    const valuetextcolor = theme['color-success-700']


    const StyledText = styled(Text);
    const StyledLayout = styled(Layout);
    const StyledCard = styled(Card);
    const fontsLoaded = useLoadFonts(); 

    return (
        <StyledLayout className="flex-1">
            <StyledLayout className='h-1/6 rounded-b-3xl justify-center items-center relative'
                style={{
                    backgroundColor: myTheme['color-success-700']
                }}>
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

            <View className="flex-1 relative">
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View>{item.component}</View>
                    )}
                    showsVerticalScrollIndicator={false}
                /> 
            </View> 
        </StyledLayout>
    </StyledLayout>
    );
};

export default Logs;