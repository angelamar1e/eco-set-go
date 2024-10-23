import React from "react";
import ReflectionButton from "./ReflectionButton";
import ReflectionsList from "./ReflectionList";
import { styled } from "nativewind";
import { Layout, Text } from '@ui-kitten/components';

const Reflection  = () => {

    const StyledLayout = styled(Layout);
    const StyledText = styled(Text);

    return(
        <StyledLayout>
        <StyledText category='h5' className="text-center">Reflection</StyledText>
        
        
        <StyledLayout className="items-center">
            <ReflectionButton />

            <ReflectionsList />
        </StyledLayout>

        </StyledLayout>
    )
};

export default Reflection;