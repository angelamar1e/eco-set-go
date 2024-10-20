import CustomDailyLog from "@/app/components/(tabs)/Goal Setting/custom_logs";
import Reflection from "@/app/components/(tabs)/Goal Setting/Reflection";
import SetGoalButton from "@/app/components/(tabs)/Goal Setting/SetGoalButton";
import { ThemedText } from "@/components/ThemedText";
import React, { ReactNode } from "react";
import { FlatList, View } from "react-native";

const GoalSetting = () => {
    const Card = ({ children }: { children: ReactNode }) => {
        return (
            <View className="bg-white rounded-full shadow-md p-4 w-[90%] shadow">
                {children}
            </View>
        );
    };

    const data = [
        { id: '1', component: <CustomDailyLog /> },
        { id: '2', component: <Reflection /> },
    ];

    const goalDates = {
        startDate: '10/20/2024',
        endDate: '11/05/2024',
    };

    return (
        <View className='flex-1'>
            <View className='bg-lime-800 h-1/4 rounded-b-3xl justify-center items-center relative'>
                <ThemedText type='subtitle' className='text-[28px] text-gray-100 mb-2'>Daily Log</ThemedText>
                <ThemedText type='default' className='text-[15px] text-gray-100'>Date</ThemedText>
            </View>

            <View className="items-center -mt-20 -bottom-5 mb-7 z-50">
                <Card>
                    <ThemedText type='default' className='text-center text-gray-400'>Carbon Reduction Goal</ThemedText>
                    <ThemedText type='title' className='text-black text-center mt-3 text-[30px]'>1000 g</ThemedText>
                    
                    <View className="flex-row items-center justify-start mt-3 left-8">
                        <ThemedText type='default' className='text-gray-400 text-[15px]'>Start: </ThemedText>
                        <ThemedText type='default' className='text-gray-600 text-[15px]'>{goalDates.startDate}</ThemedText>
                    </View>

                    <View className="flex-row items-center justify-start left-8">
                        <ThemedText type='default' className='text-gray-400 text-[15px]'>End: </ThemedText>
                        <ThemedText type='default' className='text-gray-600 text-[15px]'>{goalDates.endDate}</ThemedText>
                    </View>

                    <SetGoalButton />
                </Card>
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
        </View>
    );
};

export default GoalSetting;
