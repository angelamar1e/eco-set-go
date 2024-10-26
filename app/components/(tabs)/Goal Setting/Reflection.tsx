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

    const headertextColor = theme['color-primary-900'];

    const handleFilterDateToggle = (isClicked: boolean) => {
        console.log('Filter Date clicked:', isClicked);
      };

    return(
        <StyledCard className="rounded-lg ml-2 mr-2">
            <StyledText category='h5' 
                className="text-center mb-2" 
                style={{ color: headertextColor }}
            >
                Write your day...
            </StyledText>
            <StyledLayout  className="flex-row justify-between m-1 items-center">
                <FilterDate onToggle={handleFilterDateToggle}/>
                <ReflectionButton />
            </StyledLayout>
            <ReflectionsList />
        </StyledCard>
    )
};

export default Reflection;