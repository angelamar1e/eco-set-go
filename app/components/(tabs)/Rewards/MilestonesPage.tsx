import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Stack } from "expo-router";
import React, { ReactNode } from "react";
import { View } from "react-native";
import { ProgressBar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const Milestones = () => {
    const Card = ({ children } : {children: ReactNode}) => {
        return (
          <View className="bg-white rounded-lg shadow-md p-4 w-[330px] h-[138px] border border-stone-200">
            {children}
          </View>
        );
      };


    return (
        <ThemedView className='flex-1 px-2'>
        <SafeAreaView className='flex-1 mt-3'>
            <View className='bg-lime-800 h-1/6 rounded-b-3xl mb-4 justify-center items-center relative'>
                <ThemedText type='subtitle' className='text-[28px] text-gray-100 mb-2'>Milestones</ThemedText>
            </View>

            <View className="items-center -mt-10">
                <Card>
                    <ThemedText type='subtitle' className='text-black justify-left mb-2'>Eco Points</ThemedText>
                    <ThemedText type='default' className='text-black justify-left mt-1 text-[16px]'>Level 10</ThemedText>

                    <View className="mt-1">
                        <ProgressBar progress={0.10}  color="#4CAF50" style={{
                            height: 10,                   
                            borderRadius: 5,              
                            backgroundColor: '#e0e0e0',   
                            marginTop: 5,                 
                            width: '100%',                 
                        }}/>

                    </View>

                    <View className="flex-row justify-between mt-2">
                        <ThemedText type='defaultSemiBold' className='text-black text-[15px]'>100</ThemedText>
                        <ThemedText type='default' className='text-stone-500 text-[12px] right-[40px]'>current EcoPoints</ThemedText>
                        <ThemedText type='default' className='text-stone-500 text-[12px]  left-[40px]'>Level 11</ThemedText>
                        <ThemedText type='defaultSemiBold' className='text-black text-[15px]'>1000</ThemedText>
                    </View>
                
                </Card>
            </View>

            
        </SafeAreaView>
        </ThemedView>
    )
};

export default Milestones;
