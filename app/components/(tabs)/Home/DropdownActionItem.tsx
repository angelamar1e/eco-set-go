import React, { useState } from "react";
import { View, Text } from "react-native";
import { Checkbox, IconButton, List } from "react-native-paper";
import { Swipeable } from "react-native-gesture-handler";
import { ActionItemProps } from "@/types/ActionItemProps";
import { Layout, Select, SelectItem } from "@ui-kitten/components";
import { styled } from "nativewind";
import { ThemedText } from "@/components/ThemedText";

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
        <IconButton icon="delete" onPress={() => handleDelete(item.id)} />
      )}
    >
      <View className="flex-row justify-between items-center px-2 py-3 border-b border-gray-300">
        {/* <ThemedText className="h-15 w-56 text-m">{item.title}</ThemedText> */}
          {/* <StyledLayout className=""> */}
            <StyledSelect className="w-full" placeholder={item.title}>
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
      </View>
    </Swipeable>
  );
};

export default DropdownActionItem;
