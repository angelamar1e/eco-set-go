import { ThemedText } from "@/components/ThemedText";
import React, { ReactNode } from "react";
import { View } from "react-native";
import { ProgressBar } from "react-native-paper";
import SummaryReport from "@/app/components/(tabs)/Progress Monitoring/summary";

const ProgressReport = () => {
    const Card = ({ children } : {children: ReactNode}) => {
        return (
            <View className="bg-white rounded-full shadow-md p-4 w-[90%] shadow">
                {children}
          </View>
        );
      };


    return (
        <View className='flex-1'>
            <View className='bg-lime-800 h-1/4 rounded-b-3xl justify-center items-center relative'>
                <ThemedText type='subtitle' className='text-[28px] text-gray-100 mb-2'>Analytics Report</ThemedText>
                <ThemedText type='default' className='text-[15px] text-gray-100'>Date</ThemedText>  
            </View>

            <View className="items-center -mt-20 -bottom-5 mb-7">
                <Card>
                    <ThemedText type='default' className='text-center text-gray-400'>Progress</ThemedText>

                    <View className="mt-3">
                        <ProgressBar progress={0.20}  color="#22c55e" style={{
                            height: 10,                   
                            borderRadius: 5, 
                            backgroundColor: '#F3F4F6',   
                            marginTop: 5,                 
                            width: '100%',                 
                        }}/>
                    </View>

                    <View className="flex-row justify-between items-center mt-2 px-3">
                        <ThemedText type='defaultSemiBold' className='text-gray-600 text-[15px]'>200 g</ThemedText>
                        <ThemedText type='default' className='text-gray-400 text-[15px] text-center italic'>reduced carbon footprint</ThemedText>
                        <ThemedText type='defaultSemiBold' className='text-gray-600 text-[15px]'>1000 g</ThemedText>
                    </View>
                </Card>

            <SummaryReport />
        </View>
    </View>

    )
};

export default ProgressReport;
