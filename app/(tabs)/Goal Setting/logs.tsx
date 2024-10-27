import CustomDailyLog from "@/app/components/(tabs)/Goal Setting/custom_logs";
import Reflection from "@/app/components/(tabs)/Goal Setting/Reflection";
import SetGoalButton from "@/app/components/(tabs)/Goal Setting/SetGoalButton";
import React from "react";
import { FlatList, View } from "react-native";
import { styled } from 'nativewind';
import { Text, Layout, Card, useTheme } from "@ui-kitten/components";
import { myTheme } from "@/constants/custom-theme";

const GoalSetting = () => {
    const data = [
        { id: '1', component: <CustomDailyLog /> },
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
    const StyledCard = styled(Card)

    return (
        <StyledLayout className="flex-1">
            <StyledLayout className='h-1/4 rounded-b-3xl justify-center items-center relative'
                style={{
                    backgroundColor: myTheme['color-success-700']
                }}>
                <StyledText category="h4">Daily Log</StyledText>
                <StyledText category="s1">Date</StyledText>
            </StyledLayout>

            <View className="items-center -mt-20 -bottom-5 mb-7 z-50">
                <StyledCard style={{ borderRadius: 100, padding: 4, width: '90%', elevation: 2}}>
                    <StyledText category='p1' className='text-center' style={{ color: subtextColor1 }}>Carbon Reduction Goal</StyledText>
                    <StyledText category='h1' className='text-center mt-1' style={{ color: valuetextcolor }}>1000g</StyledText>
                    
                    <StyledLayout className="flex-row justify-between items-center mt-3">
                        <View className="flex-col justify-start left-5">
                            <View className="flex-row items-center">
                                <StyledText category='s2'style={{ color: subtextColor1 }}>Start: </StyledText>
                                <StyledText category='s2'style={{ color: subtextColor1 }}>{goalDates.startDate}</StyledText>
                            </View>
                            <View className="flex-row items-center ">
                                <StyledText category='s2' style={{ color: subtextColor1 }}>End: </StyledText>
                                <StyledText category='s2' style={{ color: subtextColor1 }}>{goalDates.endDate}</StyledText>
                            </View>
                        </View>
                        <SetGoalButton />
                    </StyledLayout>
                </StyledCard>
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
    );
};

export default GoalSetting;