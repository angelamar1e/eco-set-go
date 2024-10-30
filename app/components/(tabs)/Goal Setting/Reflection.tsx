import React from "react";
import ReflectionButton from "./ReflectionButton";
import ReflectionsList from "./ReflectionList";
import { styled } from "nativewind";
import { Card, Layout, Text, useTheme } from '@ui-kitten/components';
import FilterDate from "./FilterDate";

const Reflection  = () => {

    const StyledCard = styled(Card);
    const StyledText = styled(Text);
    const StyledLayout = styled(Layout);

    const theme = useTheme();

    const headertextColor = theme['color-success-900'];

    const handleFilterDateToggle = (isClicked: boolean) => {
        console.log('Filter Date clicked:', isClicked);
      };

    return(
        <StyledLayout className=" mt-2">
        <StyledCard className="rounded-lg">
            <StyledLayout  className="flex-row justify-between m-1 items-center">
            <StyledText category="s1" style={{ fontWeight: 'bold', }} className="mt-1 ml-3">
                Reflection
              </StyledText>
                <FilterDate onToggle={handleFilterDateToggle}/>
            </StyledLayout>
            <ReflectionsList />
        </StyledCard>
        </StyledLayout>

    )
};

export default Reflection;