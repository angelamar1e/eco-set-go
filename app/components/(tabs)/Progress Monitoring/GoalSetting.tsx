// GoalSetting.tsx
import React, { useEffect } from "react";
import { Alert, View } from "react-native";
import { styled } from "nativewind";
import { Text, Layout, Card, Datepicker, Input, ProgressBar } from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useUserGoalContext } from "@/contexts/UserGoalContext";
import { format } from "date-fns";
import { conditionalConvertGramsToKg } from '../../../utils/EstimationUtils';

const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledCard = styled(Card);
const StyledProgressBar = styled(ProgressBar);
const StyledInput = styled(Input);

const GoalSetting: React.FC = () => {
  const {
    latestGoal,
    editGoal,
    progressImpact,
    progressPercentage,
    toggleEdit,
    submitNewGoal,
    newStartDate,
    newEndDate,
    newTarget,
    setNewStartDate,
    setNewEndDate,
    setNewTarget,
  } = useUserGoalContext();
  
  return (
    <View className="items-center -mt-14 -bottom-3 mb-4 z-50 justify-items-center">
      <StyledCard className="bg-white border-0" style={{ borderRadius: 20, padding: 0, width: "90%", elevation: 2 }}>
        <StyledLayout className="ml-2 mr-2 relative bg-white">
          <View className="flex-row justify-between">
            <StyledText className="mb-1 text-lg">Your Goal</StyledText>
            <TouchableOpacity
              className="bg-lime-400 h-8 w-8 items-center justify-center rounded-3xl"
              onPress={toggleEdit}
            >
              <Ionicons name="pencil" size={18} color="white" />
            </TouchableOpacity>
          </View>

          {latestGoal && !editGoal ? (
            <>
              <View>
                <View className="mb-6 justify-center">
                  <StyledText className="text-gray-600">🟢 Started on {format(latestGoal.start_date.toDate(), "PP")}</StyledText>
                  <StyledText className="text-gray-600">🟠 {Math.ceil((latestGoal.end_date.toDate().getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} day/s left</StyledText>
                  <StyledText className="text-gray-600">🔴 To be completed by {format(latestGoal.end_date.toDate(), "PP")}</StyledText>
                </View>
                <View className="items-center">
                  <StyledProgressBar progress={progressPercentage} className="w-11/12 rounded-3xl h-3" />
                </View>
                <View className="flex-row justify-between">
                  <StyledText className="text-center text-gray-600">{conditionalConvertGramsToKg(progressImpact)}</StyledText>
                  <StyledText className="text-center text-gray-600">{conditionalConvertGramsToKg(latestGoal.target)}</StyledText>
                </View>
              </View>
            </>
          ) : (
            <View className="flex-row flex-wrap mb-4 justify-between">
              <View className="basis-1/2 p-1">
                <Datepicker label={"Start Date"} min={new Date()} date={newStartDate} onSelect={setNewStartDate} />
              </View>
              <View className="basis-1/2 p-1">
                <Datepicker label={"End Date"} min={new Date(newStartDate.getDate() + 1)} date={newEndDate} onSelect={setNewEndDate} />
              </View>
              <View className="basis-full">
                <StyledInput
                  label={"Target"}
                  caption={"in grams of CO₂e"}
                  keyboardType="number-pad"
                  // placeholder="Enter Target"
                  onChangeText={(target) => setNewTarget(parseInt(target, 10))}
                />
              </View>
              <View className="flex-row w-full justify-end">
              <TouchableOpacity
                className="mt-3"
                onPress={submitNewGoal}
              >
                <StyledText className="font-bold">→ Submit</StyledText>
              </TouchableOpacity>
              </View>
            </View>
          )}
        </StyledLayout>
      </StyledCard>
    </View>
  );
};

export default GoalSetting;