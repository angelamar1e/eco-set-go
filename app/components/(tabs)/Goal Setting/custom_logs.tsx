import React, { useState } from "react";
import { Text, Layout } from "@ui-kitten/components";
import { styled } from "nativewind";
import ToDoButton from "./ToDoButton";
import AddActionButton from "./AddActionButton";
import LogList from "./LogsList";

const CustomDailyLog = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("To-Do");

  const StyledLayout = styled(Layout);
  const StyledText = styled(Text);

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  return (
    <StyledLayout>
      <StyledText category="h5" className="m-2 text-center">
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
    </StyledLayout>
  );
};

export default CustomDailyLog;
