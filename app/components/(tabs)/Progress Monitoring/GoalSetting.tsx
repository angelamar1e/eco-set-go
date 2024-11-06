// GoalSetting.tsx
import React, { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { styled } from "nativewind";
import { Text, Layout, Card, Input, ProgressBar } from "@ui-kitten/components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useUserGoalContext } from "@/contexts/UserGoalContext";
import { format } from "date-fns";
import { conditionalConvertGramsToKg } from '../../../utils/EstimationUtils';
import CongratulationsModal from "../Goal Setting/CongratulationsModal";
import { router } from "expo-router";
import { myTheme } from "@/constants/custom-theme";
import DateTimePicker from "@react-native-community/datetimepicker"; 

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

  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState<"start" | "end" | null>(null);

  useEffect(() => {
    if (progressPercentage >= 1){
      setModalVisible(true);
    }
  }, [progressPercentage])
  
  const headertextColor = myTheme['color-success-900'];

  return (
    <View className="items-center -mt-14 -bottom-3 mb-4 z-50 justify-items-center">
      <StyledCard className="bg-white border-0" style={{ borderRadius: 25, padding: 0, width: "90%", elevation: 2 }}>

          <View className="flex-row items-center justify-between mb-4">
            <StyledText className="mb-1 text-xl p-2" style={{ color: headertextColor, fontFamily: 'Poppins-SemiBold'}}>Your Goal 🎯</StyledText>
            <TouchableOpacity
              className="items-center justify-center rounded-full p-2"
              style={{ backgroundColor: myTheme['color-basic-transparent-100'],
                borderColor: myTheme['color-basic-600'], 
                borderWidth: 1
              }}
              onPress={toggleEdit}
            >
              <MaterialCommunityIcons name="calendar-edit" size={18} color="#8F9BB3" />
            </TouchableOpacity>
          </View>

          {latestGoal && !editGoal ? (
            <>
              <View>
                <View className="items-center">
                  <StyledProgressBar progress={progressPercentage} className="w-full rounded-3xl h-3 mb-1" />
                </View>
                <View className="flex-row justify-between">
                  <StyledText className="text-20" style={{ fontFamily: 'Poppins-Regular', color: myTheme['color-basic-700']}}>{conditionalConvertGramsToKg(progressImpact)}</StyledText>
                  <StyledText className="text-20" style={{ fontFamily: 'Poppins-SemiBold', color: myTheme['color-basic-700']}}>{conditionalConvertGramsToKg(latestGoal.target)}</StyledText>
                </View>
                <View className="flex-row items-center justify-between mt-3">
                  <StyledText className="" style={{ fontFamily: 'Poppins-Regular', color: myTheme['color-basic-900'], fontSize: 13}}>🟢 Started on {format(latestGoal.start_date.toDate(), "PP")}</StyledText>
                  <StyledText className="" style={{ fontFamily: 'Poppins-Regular', color: myTheme['color-basic-900'], fontSize: 13}}>🟠 To be completed by {format(latestGoal.end_date.toDate(), "PP")}</StyledText>
                  <StyledText className="" style={{ fontFamily: 'Poppins-Regular', color: myTheme['color-basic-900'], fontSize: 13}}>🔴 {Math.ceil((latestGoal.end_date.toDate().getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} day/s left</StyledText>
                </View>
              </View>
            </>
          ) : (
            <View className="flex-row flex-wrap mb-4 justify-between">
            <View className="basis-1/2">
              <StyledText category="label" className="mb-1" style={{ color: myTheme['color-basic-600']}}>Start Date</StyledText>
              <TouchableOpacity
                className="p-2 border rounded-lg mr-1 "
                style={{ borderColor: myTheme['color-basic-600'], backgroundColor: myTheme['color-basic-200'] }}
                onPress={() => setShowDatePicker("start")}
              >
                <StyledText className="text-lg pl-1" style={{ color: myTheme['color-basic-700'] }}>
                  {newStartDate ? newStartDate.toLocaleDateString() : 'Select Start Date'}
                </StyledText>
              </TouchableOpacity>
              {showDatePicker === "start" && (
                <DateTimePicker
                  value={newStartDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(null); 
                    selectedDate && setNewStartDate(selectedDate);
                  }}
                />
              )}
            </View>

            {/* Touchable Card for End Date */}
            <View className="basis-1/2">
              <StyledText category="label" className="mb-1 ml-1" style={{ color: myTheme['color-basic-600']}}>End Date</StyledText>
              <TouchableOpacity
                className="p-2 border rounded-lg ml-1"
                style={{ borderColor: myTheme['color-basic-600'], backgroundColor: myTheme['color-basic-200'] }}
                onPress={() => setShowDatePicker("end")}
              >
                <StyledText className="text-lg pl-1" style={{ color: myTheme['color-basic-700'] }}>
                  {newEndDate ? newEndDate.toLocaleDateString() : 'Select End Date'}
                </StyledText>
              </TouchableOpacity>
              {showDatePicker === "end" && (
                <DateTimePicker
                  value={newEndDate || new Date(newStartDate?.getTime() + 86400000)} // Default next day if no end date
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(null); 
                    selectedDate && setNewEndDate(selectedDate);
                  }}
                />
              )}
            </View>

            {/* Target Input */}
            <View className="basis-full mt-3">
              <StyledInput
                style={{ backgroundColor: myTheme['color-basic-200'], borderColor: myTheme['color-basic-600']  }}
                className="rounded-lg"
                label={"Target"}
                caption={"in grams of CO₂e"}
                keyboardType="number-pad"
                onChangeText={(target) => setNewTarget(parseInt(target, 10))}
              />
            </View>

            {/* Submit Button */}
            <View className="flex-row w-full justify-end">
              <TouchableOpacity
                className="mt-3 border rounded-full p-1 px-4"
                style={{ borderColor: myTheme['color-success-700'], backgroundColor: myTheme['color-success-700'] }}
                onPress={submitNewGoal}
              >
                <StyledText category="label" className="py-1 px-3" style={{ color: 'white' }}>Submit</StyledText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </StyledCard>
    </View>
  );
};

export default GoalSetting;
