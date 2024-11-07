import React, { useContext } from "react";
import { EmissionsContext } from "@/contexts/Emissions";
import { Text, Layout } from "@ui-kitten/components";
import { styled } from 'nativewind';
import { myTheme } from "@/constants/custom-theme";
import { useUserContext } from "@/contexts/UserContext";

const StyledTextLarge = styled(Text);
const StyledTextSmall = styled(Text);
const StyledLayout = styled(Layout);

const Calculator: React.FC = () => {
  const { currentFootprint } = useUserContext();

  return (
    <StyledLayout className="flex-row items-center justify-center shadow p-2">
      <StyledTextLarge
        category='h1' 
        style={{ color: myTheme["color-success-700"] }}
        className="ml-2"
      >
        {currentFootprint.toFixed(2)}
      </StyledTextLarge>
      <StyledTextSmall
        category="p1"
        style={{ color: myTheme["color-success-900"] }} 
        className="ml-2" 
      >
        tons{"\n"}of CO2e per year
      </StyledTextSmall>
    </StyledLayout>
  );
};

export default Calculator;
