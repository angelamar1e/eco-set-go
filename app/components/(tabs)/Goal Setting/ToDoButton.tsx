import React from "react";
import { Button, Text } from "@ui-kitten/components";
import { styled } from "nativewind";

interface ToDoButtonProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const StyledButton = styled(Button);

const ToDoButton: React.FC<ToDoButtonProps> = ({ selectedFilter, onFilterChange }) => {
  const filters = ['All', 'To Do', 'Done'];

  return (
    <>
      {filters.map((category) => (
        <StyledButton
          key={category}
          onPress={() => onFilterChange(category)}
          className="rounded-full p-1 m-1"
          size="small"
          appearance={selectedFilter === category ? "filled" : "outline"}
          status={selectedFilter === category ? "success" : "basic"}
        >
          <Text category="label">{category}</Text>
        </StyledButton>
      ))}
    </>
  );
};

export default ToDoButton;
