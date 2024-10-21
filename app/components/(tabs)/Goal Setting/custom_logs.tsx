import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { ToDoButton } from "./ToDoButton";
import { View } from "react-native";
import AddActionButton from "./AddActionButton";
import LogList from "./LogsList";

const CustomDailyLog  = () => {

    return (
        <ThemedView>
            <ThemedText type="subtitle" className="text-lime-800 text-[25px] mt-1 p-3 text-center">Customize your Daily Log</ThemedText>
            
            <View className='flex-row mb-4'>
                <ToDoButton 
                    title="To-Do"        
                    variant="primary"       
                />
                <ToDoButton 
                    title="Done"       
                    variant="secondary"      
                />

                <AddActionButton />      
            </View>  

            <View> 
                <LogList />
            </View>
        </ThemedView>


    )

};

export default CustomDailyLog;

