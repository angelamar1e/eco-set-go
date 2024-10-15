import CustomDailyLog from "@/app/components/(tabs)/Goal Setting/custom_logs";
import Reflection from "@/app/components/(tabs)/Goal Setting/Reflection";
import SetGoalButton from "@/app/components/(tabs)/Goal Setting/SetGoalButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Stack } from "expo-router";
import React, { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GoalSetting = () => {
    const Card = ({ children } : {children: ReactNode}) => {
        return (
          <View className="bg-white rounded-lg shadow-md p-4 w-[330px] h-[138px] border border-stone-200">
            {children}
          </View>
        );
      };

    return (
        <ThemedView className='flex-1 px-2'>
        <><Stack>
            <Stack.Screen name="logs" options={{ headerShown: false }} />
        </Stack>
        <SafeAreaView className='flex-1 mt-3'>
            <View className='bg-lime-800 h-1/6 rounded-b-3xl mb-4 justify-center items-center relative'>
                <ThemedText type='subtitle' className='text-[28px] text-gray-100 mb-2'>Daily Log</ThemedText>
                <ThemedText type='default' className='text-[15px] text-gray-100'>Date</ThemedText>  
            </View>

            <View className="items-center -mt-10">
                <Card>
                    <ThemedText type='subtitle' className='text-black justify-left'>Carbon Reduction Goal</ThemedText>
                    <ThemedText type='title' className='text-black justify-left mt-3 text-[30px]'>1000 g</ThemedText>
                    <ThemedText type='default' className='text-black justify-left mt-3 text-[15px]'>Start: </ThemedText>
                    <ThemedText type='default' className='text-black justify-left text-[15px]'>End: </ThemedText>

                    <SetGoalButton />
                </Card>
            </View>

            <CustomDailyLog />
            
            <Reflection />
            
        </SafeAreaView></>
        </ThemedView>
    )
};

export default GoalSetting;
