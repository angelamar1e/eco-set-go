import React from "react";
import { styled } from "nativewind";
import { ScrollView } from "react-native";
import { Text, Layout } from "@ui-kitten/components";

interface Milestone {
  title: string;
  content: string;
  date: string;
}

const StyledLayout = styled(Layout);
const StyledText = styled(Text);

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

  // Define the props type for the Box component
  interface BoxProps {
    title: string;
    content: string;
    date: string;
    className?: string;
  }

  const Box: React.FC<BoxProps> = ({ title, content, date, className = "" }) => (
    <StyledLayout
      className={`justify-center bg-lime-800 rounded-lg p-3 mb-4 w-[22.75%] h-[20%] mr-2 ${className}`}
    >
      <StyledText category="s1">{title}</StyledText>
      <StyledText category="p2" className="text-[14px] text-stone-300 mt-1 italic top-[50px]">{content}</StyledText>
      <StyledText category="c1" className="text-[12px] text-stone-300 mt-3 mb-3 top-[50px]">{date}</StyledText>
    </StyledLayout>
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
