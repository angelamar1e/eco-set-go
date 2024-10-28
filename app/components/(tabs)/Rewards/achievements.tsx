import React from "react";
import MilestoneList from "./MilestonesList";
import { styled } from "nativewind";
import { Text, Layout, useTheme } from '@ui-kitten/components';

const Achievements = () => {
    const StyledLayout = styled(Layout);
    const StyledText = styled(Text);

    const theme = useTheme();
    const headertextColor = theme['color-success-900'];

    return (
        <StyledLayout className="items-center">
            <StyledLayout className="items-center justify-between mt-3 relative">
                <StyledText category="h5" className="text-center" style={{ color: headertextColor }}>Achieved</StyledText>
            </StyledLayout>

            <StyledLayout>
                <MilestoneList />
            </StyledLayout>
        </StyledLayout>
    )
};

export default Achievements;
