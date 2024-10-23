import { Ionicons } from "@expo/vector-icons";
import React from "react";
import MilestoneList from "./MilestonesList";
import { styled } from "nativewind";
import { Text, Layout } from '@ui-kitten/components';

const Achievements = () => {
    const StyledLayout = styled(Layout);
    const StyledText = styled(Text);

    return (
        <StyledLayout className="flex items-center px-4">
            <StyledLayout className="flex-row items-center mt-3 p-3 w-full justify-between">
                <StyledText category="s1">
                    Level 10
                </StyledText>

            </StyledLayout>

            <StyledLayout className="flex-row items-center w-full justify-between">
                <StyledText category='h6'>
                    Achieved
                </StyledText>
                <Ionicons name="search" size={18} color="#6B7280" style={{ marginRight: 18 }} label='Search' />
            </StyledLayout>

            <StyledLayout>
                <MilestoneList />
            </StyledLayout>

        </StyledLayout>
    )
};

export default Achievements;
