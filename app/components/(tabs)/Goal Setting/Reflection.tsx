import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import ReflectionButton from "./ReflectionButton";
import { View } from "react-native";
import ReflectionsList from "./ReflectionList";

const Reflection  = () => {

    return(
        <ThemedView className="flex-1">
            <ThemedText type="subtitle" className="text-lime-800 text-[25px] p-3 text-center">Reflection</ThemedText>
        
            <View className="items-center">
                <ReflectionButton />

                <ReflectionsList />
            </View>
            


        </ThemedView>
    )
};

export default Reflection;