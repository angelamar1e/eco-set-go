import React from "react";
import { styled } from "nativewind";
import { ScrollView } from "react-native";
import { Text, Layout, Card, useTheme } from "@ui-kitten/components";
import { myTheme } from "@/constants/custom-theme";

interface Milestone {
  title: string;
  content: string;
  date: string;
}

const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledCard = styled(Card);

const MilestoneList: React.FC = () => {
  const milestones: Milestone[] = [
    {
      title: "Reached 100 kg CO2",
      content: "You have reduced your carbon footprint by 20 kg!",
      date: "2024-10-01",
    },
    {
      title: "Adopted Eco-Friendly Practices",
      content: "Started using reusable bags and containers.",
      date: "2024-09-15",
    },
    {
      title: "Completed Carbon Footprint Challenge",
      content: "Participated in the challenge for a month.",
      date: "2024-08-30",
    },
  ];

  const theme = useTheme();
  const titleTextColor = theme['color-info-500'];
  const dateTextColor = theme['color-primary-900'];


  // Define the props type for the Box component
  interface BoxProps {
    title: string;
    content: string;
    date: string;
    className?: string;
  }

  const Box: React.FC<BoxProps> = ({ title, content, date, className = "" }) => (
    <StyledCard
      className={`justify-center rounded-lg p-2 w-1/6 h-1/4 mr-1 ml-1 ${className}`}
      style={{ 
        paddingVertical: 16, 
        paddingHorizontal: 12, 
        flexDirection: "column", 
        borderWidth: 1,
        elevation: 1  
      }}
    >
      <StyledText category="h6" className="mb-4" numberOfLines={4}
        style={{ color: titleTextColor }}
      >
        {title}
      </StyledText>
      <StyledText category="p2" className="mb-6" numberOfLines={4} ellipsizeMode="tail">
        {content}
      </StyledText>
      <StyledText category="label" className="mt-auto" numberOfLines={1}
        style={{ color: dateTextColor }}
      >
        {date}
      </StyledText>
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
            date={milestone.date}
          />
        ))}
      </ScrollView>
    </StyledLayout>
  );
};

export default MilestoneList;
