import React from "react";
import { styled } from "nativewind";
import { ScrollView, View } from "react-native";
import { Text, Layout, Card, useTheme } from "@ui-kitten/components";


interface Milestone {
  title: string;
  content: string;
}

const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledCard = styled(Card);

const MilestoneList: React.FC = () => {
  const milestones: Milestone[] = [
    {
      title: "Reached 100 kg CO2",
      content: "You have reduced your carbon footprint by 20 kg!",
    },
    {
      title: "Adopted Eco-Friendly Practices",
      content: "Started using reusable bags and containers.",
    },
    {
      title: "Completed Carbon Footprint Challenge",
      content: "Participated in the challenge for a month.",
    },
  ];

  const theme = useTheme();
  const titleTextColor = theme['color-info-500'];
  const dateTextColor = theme['color-primary-900'];


  // Define the props type for the Box component
  interface BoxProps {
    title: string;
    content: string;
    className?: string;
  }

  const Box: React.FC<BoxProps> = ({ title, content, className = "" }) => (
    <StyledCard
      className={`justify-center rounded-lg w-1/8 h-1/3 mr-1 ml-1 ${className}`}
      style={{
        paddingHorizontal: 10,
        flexDirection: "column",
        borderWidth: 1,
        position: "relative",
      }}
    >
      <View className="top-20 right-3">
        <StyledText category="h6" className="mt-5 mb-2" numberOfLines={3} style={{ color: titleTextColor }}>
          {title}
        </StyledText>
        <StyledText category="p2" className="mb-6" numberOfLines={4} ellipsizeMode="tail">
          {content}
        </StyledText>
      </View>
    </StyledCard>
  );
  
  return (
    <StyledLayout className="relative mt-5">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        {milestones.map((milestone, index) => (
          <Box
            key={index}
            title={milestone.title}
            content={milestone.content}
          />
        ))}
      </ScrollView>
    </StyledLayout>
  );
};

export default MilestoneList;
