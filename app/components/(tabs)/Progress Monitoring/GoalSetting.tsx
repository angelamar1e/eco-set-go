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
import TipsModal from "../../quiz/tips";
import { Ionicons } from "@expo/vector-icons";
import TargetTips from "./TargetTips";

const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledCard = styled(Card);
const StyledProgressBar = styled(ProgressBar);
const StyledInput = styled(Input);

const GoalSetting: React.FC = () => {
  const {
    latestGoal,
    editGoal,
    setEditGoal,
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
  const [tooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    if (progressPercentage >= 1){
      setModalVisible(true);
    }
  }, [progressPercentage]);

  const closeModal = () => {
    setModalVisible(false);
  }

  const showGoalEditor = () => {
    router.push('/(tabs)/Progress Monitoring/report');
    setEditGoal(true);
    setModalVisible(false);
  }
  
  const headertextColor = myTheme['color-success-900'];

  return (
    <View className="items-center -mt-14 -bottom-3 mb-4 z-50 justify-items-center">
      <CongratulationsModal visible={modalVisible} onClose={() => closeModal()} onSetNewGoal={() => showGoalEditor()}/>
      <StyledCard className="bg-white border-0" style={{ borderRadius: 25, padding: 0, width: "90%", elevation: 2 }}>

          <View className="flex-row items-center justify-between mb-4">
            <StyledText className="text-lg p-2" style={{ color: headertextColor, fontFamily: 'Poppins-SemiBold'}}>Your Goal 🎯</StyledText>
            <TouchableOpacity
              className="items-center justify-center rounded-full p-2"
              style={{ backgroundColor: myTheme['color-basic-transparent-100'],
                borderColor: myTheme['color-basic-600'], 
                borderWidth: 1
              }}
              onPress={toggleEdit}
            >
              <MaterialCommunityIcons name="calendar-edit" size={16} color="#8F9BB3" />
            </TouchableOpacity>
          </View>

          {latestGoal && !editGoal ? (
            <>
              <View>
                <View className="items-center">
                  <StyledProgressBar progress={progressPercentage} className="w-full rounded-3xl h-3 mb-1" />
                </View>
                <View className="flex-row justify-between">
                  <StyledText style={{ fontFamily: 'Poppins-Regular', color: myTheme['color-basic-700'], fontSize: 13}}>{conditionalConvertGramsToKg(progressImpact)}</StyledText>
                  <StyledText style={{ fontFamily: 'Poppins-SemiBold', color: myTheme['color-basic-700'], fontSize: 13}}>{conditionalConvertGramsToKg(latestGoal.target)}</StyledText>
                </View>
                <View className="flex-start mt-1">
                  <StyledText className="" style={{ fontFamily: 'Poppins-Regular', color: myTheme['color-basic-900'], fontSize: 12}}>🔴 <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14}}>{Math.ceil((latestGoal.end_date.toDate().getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}</Text> day/s left</StyledText>
                  <StyledText className="" style={{ fontFamily: 'Poppins-Regular', color: myTheme['color-basic-900'], fontSize: 12}}>🟢 Started on <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14}}>{format(latestGoal.start_date.toDate(), "PP")}</Text></StyledText>
                  <StyledText className="" style={{ fontFamily: 'Poppins-Regular', color: myTheme['color-basic-900'], fontSize: 12}}>🟠 To be completed by <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14}}>{format(latestGoal.end_date.toDate(), "PP")}</Text></StyledText>
                </View>
              </View>
            </>
          ) : (
            <View className="flex-row flex-wrap mb-4 justify-between">
            <View className="basis-1/2">
              <StyledText category="label" className="mb-1" style={{ color: myTheme['color-basic-600'], fontFamily: 'Poppins-Medium'}}>Start Date</StyledText>
              <TouchableOpacity
                className="p-2 border rounded-lg mr-1 "
                style={{ borderColor: myTheme['color-basic-600'], backgroundColor: myTheme['color-basic-200'] }}
                onPress={() => setShowDatePicker("start")}
              >
                <StyledText className="pl-1" style={{ color: myTheme['color-basic-700'], fontSize: 16}}>
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
                style={{ borderColor: myTheme['color-basic-600'], backgroundColor: myTheme['color-basic-200']}}
                onPress={() => setShowDatePicker("end")}
              >
                <StyledText className="pl-1" style={{ color: myTheme['color-basic-700'], fontSize: 16,}}>
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

            <TargetTips
              visible={tooltipVisible}
              onClose={() => setTooltipVisible(false)}
            />

            {/* Target Input */}
            <View className="flex-row basis-full mt-3">
              <StyledInput
                style={{ backgroundColor: myTheme['color-basic-200'], borderColor: myTheme['color-basic-600'], flex: 1 }}
                className="rounded-lg"
                label={
                  <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <StyledText category="label" style={{ color: myTheme['color-basic-600'], }}>Target
                    <TouchableOpacity onPress={() => setTooltipVisible(true)} style={{ marginLeft: 4, top: 4 }}>
                      <Ionicons name="information-circle-outline" size={17} color={myTheme['color-primary-600']} />
                    </TouchableOpacity>
                    </StyledText>
                  </View>
                }
                caption={<StyledText style={{fontFamily: 'Poppins-Regular', fontSize: 12}}>in grams of CO₂e</StyledText>}
                keyboardType="number-pad"
                onChangeText={(target) => setNewTarget(parseInt(target, 10))}
              />
            </View>

            {/* Submit Button */}
            <View className="flex-row w-full justify-end">
              <TouchableOpacity
                className="mt-3 rounded-full p-1 px-4"
                onPress={submitNewGoal}
              >
                <View className="flex-row items-center">
                <StyledText
                  category="p1"
                  className="text-sm font-bold text-right"
                  style={{color: myTheme['color-success-700']}}
                >
                  → Submit
                </StyledText>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </StyledCard>
    </View>
  );
};

export default GoalSetting;
