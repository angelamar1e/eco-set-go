import React from "react";
import { styled } from "nativewind";
import { ScrollView, View } from "react-native";
import { Text, Layout, Card, useTheme } from "@ui-kitten/components";
import { myTheme } from "@/constants/custom-theme";
import {  Ionicons } from "@expo/vector-icons";

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
      className={`justify-center rounded-lg w-1/6 h-1/3 mr-1 ml-1 ${className}`}
      style={{
        paddingHorizontal: 12,
        flexDirection: "column",
        borderWidth: 1,
        position: "relative",
      }}
    >
      <StyledLayout
        className="absolute"
        style={{
          top: "0%",
          left: "120%",
          transform: [{ translateY: -40 }],
          zIndex: 1,
          padding: 0,
          margin: 0,
        }}
      >
        <Ionicons name="ribbon-outline" 
          size={35} 
          color={'green'}
        />
      </StyledLayout>
      <View className="top-10 right-3">
        <StyledText category="h6" className="mt-5 mb-2" numberOfLines={3} style={{ color: titleTextColor }}>
          {title}
        </StyledText>
        <StyledText category="p2" className="mb-6" numberOfLines={4} ellipsizeMode="tail">
          {content}
        </StyledText>
        <StyledText category="label" className="mt-auto" numberOfLines={1} style={{ color: dateTextColor }}>
          {date}
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
            date={milestone.date}
          />
        ))}
      </ScrollView>
    </StyledLayout>
  );
};

export default MilestoneList;
