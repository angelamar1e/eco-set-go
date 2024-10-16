import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Stack } from "expo-router";
import React, { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { ProgressBar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import SummaryReport from "@/app/components/(tabs)/Progress Monitoring/summary";

const ProgressReport = () => {
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
            <Stack.Screen name="report" options={{ headerShown: false }} />
        </Stack>
        <SafeAreaView className='flex-1 mt-3'>
            <View className='bg-lime-800 h-1/6 rounded-b-3xl mb-4 justify-center items-center relative'>
                <ThemedText type='subtitle' className='text-[28px] text-gray-100 mb-2'>Analytics Report</ThemedText>
                <ThemedText type='default' className='text-[15px] text-gray-100'>Date</ThemedText>  
            </View>

            <View className="items-center -mt-10">
                <Card>
                    <ThemedText type='subtitle' className='text-black justify-left mb-2'>Progress</ThemedText>
                    <ThemedText type='default' className='text-black justify-left mt-1 text-[16px]'>Reduced carbon footprint</ThemedText>

                    <View className="mt-1">
                        <ProgressBar progress={0.5}  color="#4CAF50" style={{
                            height: 10,                   
                            borderRadius: 5,              
                            backgroundColor: '#e0e0e0',   
                            marginTop: 5,                 
                            width: '100%',                 
                        }}/>

                    </View>

                    <View className="flex-row justify-between mt-2">
                        <ThemedText type='defaultSemiBold' className='text-black text-[15px]'>200 g</ThemedText>
                        <ThemedText type='defaultSemiBold' className='text-black text-[15px]'>1000 g</ThemedText>
                    </View>
                
                </Card>
            </View>

            <SummaryReport />

            
        </SafeAreaView></>
        </ThemedView>
    )
};

export default ProgressReport;
