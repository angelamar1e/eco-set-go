import { ThemedText } from "@/components/ThemedText";
import React, { useState } from "react";
import { ToDoButton } from "./ToDoButton";
import { View } from "react-native";
import AddActionButton from "./AddActionButton";
import LogList from "./LogsList";

const CustomDailyLog  = () => {

    const [activeButton, setActiveButton] = useState<"todo" | "done">("todo");
    const [isAddButtonFocused, setIsAddButtonFocused] = useState(false);

    const handleAddButtonClick = () => {
        setIsAddButtonFocused(!isAddButtonFocused);
      };

    return (
        <View className="bg-white rounded-lg mb-2 ml-2 mr-2">
            <ThemedText type="subtitle" className="text-lime-800 text-[25px] mt-1 p-3 text-center">
                Customize your Daily Log
            </ThemedText>
            
            <View className='flex-row mb-4 items-center'>
                <View className="flex-row ml-5">
                    <ToDoButton 
                        title="To-Do"        
                        isActive={activeButton === "todo"}
                        onPress={() => setActiveButton("todo")}
                    />
                    <ToDoButton 
                        title="Done"       
                        isActive={activeButton === "done"}
                        onPress={() => setActiveButton("done")}
                    />
                </View>
                <AddActionButton isFocused={isAddButtonFocused} onPress={handleAddButtonClick} />
            </View>

            <View> 
                <LogList />
            </View>
        </View>


    )

};

export default CustomDailyLog;

