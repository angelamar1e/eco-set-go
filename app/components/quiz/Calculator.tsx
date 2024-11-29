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
  const { newOverallFootprint } = useContext(EmissionsContext);

  return (
    <StyledLayout className="flex-row items-center justify-center shadow">
      <StyledTextLarge
        style={{ 
          fontFamily: 'Poppins-Bold',
          color: myTheme["color-success-700"],
          fontSize: 35,
          top: 5
        }}
        className="ml-2"
      >
        {newOverallFootprint.toFixed(2)}
      </StyledTextLarge>
      <StyledTextSmall
        style={{ 
          fontFamily: 'Poppins-Regular',
          fontSize: 14,
          color: myTheme["color-success-900"],
          lineHeight: 20
        }}
        className="ml-2" 
      >
        tons{"\n"}of CO₂e per year
      </StyledTextSmall>
    </StyledLayout>
  );
};

export default Calculator;
