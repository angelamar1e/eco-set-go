import { ThemedText } from "@/components/ThemedText";
import React from "react";
import ReflectionButton from "./ReflectionButton";
import { View } from "react-native";
import ReflectionsList from "./ReflectionList";

const Reflection  = () => {

    return(
        <View className="bg-white rounded-lg shadow-md mb-2 ml-2 mr-2">
            <ThemedText type="subtitle" className="text-lime-800 text-[25px] mt-1 p-3 text-center">Write your day...</ThemedText>
        
            <ReflectionButton />

            <View className="items-center">
                <ReflectionsList />
            </View>
        </View>
    )
};

export default Reflection;