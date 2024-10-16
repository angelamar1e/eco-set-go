import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { styled } from "nativewind";
import React from "react";
import { ScrollView, View } from "react-native";

interface Milestone {
  title: string;
  content: string;
  date: string;
}

const MilestoneList: React.FC = () => {
  // Dummy data for milestones
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

  const StyledView = styled(View);

  // Define the props type for the Box component
  interface BoxProps {
    title: string;
    content: string;
    date: string;
    className?: string;
  }

  const Box: React.FC<BoxProps> = ({ title, content, date, className = "" }) => (
    <StyledView
      className={`justify-center bg-lime-800 rounded-lg p-3 mb-4 w-[22.75%] h-[20%] mr-2 ${className}`} // Reduced width and padding
    >
      <ThemedText type="defaultSemiBold" className="text-[16px] text-white top-[50px]">{title}</ThemedText> 
      <ThemedText type="default" className="text-[14px] text-stone-300 mt-1 italic top-[50px]">{content}</ThemedText> 
      <ThemedText type="default" className="text-[12px] text-stone-300 mt-3 mb-3 top-[50px]">{date}</ThemedText>
    </StyledView>
  );

  return (
    <ThemedView className="relative mt-5">
      <ScrollView horizontal 
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
    </ThemedView>
  );
};

export default MilestoneList;
