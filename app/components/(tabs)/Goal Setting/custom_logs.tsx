import React, { useState } from "react";
import { Text, Layout, Card, useTheme } from "@ui-kitten/components";
import { styled } from "nativewind";
import ToDoButton from "./ToDoButton";
import AddActionButton from "./AddActionButton";
import LogList from "./LogsList";

const CustomDailyLog = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("To-Do");

  const StyledLayout = styled(Layout);
  const StyledText = styled(Text);
  const StyledCard = styled(Card)

  const theme = useTheme();

  const headertextColor = theme['color-primary-900'];

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  return (
    <StyledCard className="rounded-lg ml-2 mr-2 mb-2">
      <StyledText category="h5" className="text-center" style={{ color: headertextColor }}>
        Customize your Daily Log
      </StyledText>

      <StyledLayout className="m-2 flex-row justify-between items-center">
        <StyledLayout className="flex-row">
          <ToDoButton 
            selectedFilter={selectedFilter} 
            onFilterChange={handleFilterChange} 
          />
        </StyledLayout>
        <AddActionButton />
      </StyledLayout>

      <StyledLayout>
        <LogList />
      </StyledLayout>
    </StyledCard>
  );
};

export default CustomDailyLog;
