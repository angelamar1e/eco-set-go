import React, { useState } from "react";
import { View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { ActionItemProps } from "@/types/ActionItemProps";
import { Layout, Select, SelectItem } from "@ui-kitten/components";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { myTheme } from "@/constants/custom-theme";

const StyledLayout = styled(Layout);
const StyledSelect = styled(Select);
const StyledSelectItem = styled(SelectItem);

const DropdownActionItem: React.FC<ActionItemProps> = ({
  item,
  completedActions,
  handleComplete,
  handleDelete,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleDropdown = () => setExpanded(!expanded);

  return (
    <Swipeable
      renderRightActions={() => (
        <View className="flex items-center justify-center ml-2 mr-4">
          <Ionicons name="trash" size={20} color="red" onPress={() => handleDelete(item.id)} />
        </View>      
      )}
    >
      <StyledLayout className="pt-1 m-1">
      {/* <ThemedText className="h-15 w-56 text-m">{item.title}</ThemedText> */}
          {/* <StyledLayout className=""> */}
            <StyledSelect className="w-full rounded-lg" placeholder={item.title}>
              {item.options ? (
            Object.entries(item.options).map(([key, value]) => (
              <StyledSelectItem className=""  
                key={key}
                title={key}
                onPress={() => {
                  handleComplete(item.id, value);
                  setExpanded(false); // Collapse the dropdown after selection
                }}
              />
            ))
          ) : (
            <></> )}
            </StyledSelect>
          {/* </StyledLayout> */}
      </StyledLayout>
    </Swipeable>
  );
};

export default DropdownActionItem;
