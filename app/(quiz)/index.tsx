import React, { useState, useEffect, useContext, useMemo } from "react";
import { View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { QuizContext } from "@/contexts/QuizContext";
import { EmissionsContext } from "@/contexts/Emissions";
import { QuestionData } from "@/types/QuestionData";
import InputTemplate from "../components/quiz/InputTemplate";
import CheckboxTemplate from "../components/quiz/CheckboxTemplate";
import StepperTemplate from "../components/quiz/StepperTemplate";
import RadioTemplate from "../components/quiz/RadioTemplate";
import { router, useLocalSearchParams } from "expo-router";
import { styled } from "nativewind";
import { Layout, Text } from "@ui-kitten/components";
import storage from "@react-native-firebase/storage";
import { myTheme } from "@/constants/custom-theme";
import TipsModal from "../components/quiz/tips";
import { NavigationButtons } from "../components/quiz/NavigationButtons";
import Modal1 from "../components/quiz/Modal1";
import Modal2 from "../components/quiz/Modal2";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import { EmissionsData } from '../../constants/DefaultValues';

const StyledLayout = styled(Layout);

const QuizIndex = () => {
  const { questionIndex } = useLocalSearchParams();
  const [currentQuestionId, setCurrentQuestionId] = useState<
    string | string[]
  >();
  const { questionDocumentIds, questionCollection } = useContext(QuizContext);
  const emissionsContext = useContext(EmissionsContext);
  const [questionData, setQuestionData] = useState<QuestionData>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState<any>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [showModal1, setShowModal1] = useState(true);
  const [showModal2, setShowModal2] = useState(false);
  const [loading, setLoading] = useState(true);
  const templates = [
    InputTemplate,
    RadioTemplate,
    CheckboxTemplate,
    StepperTemplate,
  ];

  const {emissionsData} = useContext(EmissionsContext);

  // Update current question index when the search params change
  useEffect(() => {
    if (questionIndex) {
      setCurrentQuestionIndex(parseInt(questionIndex.toString()));
    }
  }, [questionIndex]);

  // Set current question ID when the current question index changes
  useEffect(() => {
    if (currentQuestionIndex !== null && questionDocumentIds) {
      setCurrentQuestionId(questionDocumentIds[currentQuestionIndex]);
    }
  }, [currentQuestionIndex, questionDocumentIds]);

  // Fetch question data when the currentQuestionId changes
  useEffect(() => {
    const fetchQuestion = async () => {
      if (currentQuestionId) {
        try {
          setLoading(true);
          const snapshot = await questionCollection
            .doc(currentQuestionId)
            .get();
          if (snapshot.exists) {
            const fetchedQuestionData = snapshot.data();
            if (fetchedQuestionData.image) {
              // Load the image URL
              const imageUrl = await loadImage(fetchedQuestionData.image);
              fetchedQuestionData.image = imageUrl; // Set the image URL
            }
            setQuestionData(fetchedQuestionData);
          } else {
            console.log("No document found for this question");
          }
        } catch (error) {
          console.error("Error fetching document:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuestion();
  }, [currentQuestionId]);

  const loadImage = async (gsUrl: string): Promise<string | null> => {
    try {
      const url = await storage().refFromURL(gsUrl).getDownloadURL();
      return url;
    } catch (error) {
      console.error("Error loading image:", error);
      return null;
    }
  };

  const handleAnswer = (value: any | string[]) => {
    const variable = questionData?.variable;
    if (
      ["20", "21", "22"].includes(questionDocumentIds[currentQuestionIndex])
    ) {
      value *= 2;
    }
    setCurrentAnswer(value);
    console.log("Answer set:", value);
    if (variable) {
      const setter =
        emissionsContext[
          `set${variable.charAt(0).toUpperCase()}${variable.slice(1)}`
        ];
      setter(value);
    }
  };

  const goToNextComponent = () => {
    const prevAnswer = emissionsContext[questionData!.variable];
  
    // Define conditions and their respective target indices
    const conditions = [
      { condition: currentQuestionIndex === 0 && (currentAnswer === 0 || prevAnswer === 0), index: 7 },
      { condition: currentQuestionIndex === 2 && (currentAnswer === "car-sharer" || prevAnswer === "car-sharer"), index: 7 },
      { condition: currentQuestionIndex === 7 && (currentAnswer === false || prevAnswer === false), index: 10 },
      { condition: currentQuestionIndex === 10 && (currentAnswer?.length === 0 || prevAnswer?.length === 0), index: 13 },
      { condition: currentQuestionIndex === 10 && (arraysMatch(currentAnswer, ["bike"]) || arraysMatch(prevAnswer, ["bike"])), index: 13 },
      { condition: currentQuestionIndex === 10 && (!emissionsData['selectedTransports'].includes("eBike")), index: 12 },
      { condition: currentQuestionIndex === 11 && (!emissionsData['selectedTransports'].includes("smallVh")), index: 13 },
      { condition: currentQuestionIndex === 14 && (currentAnswer?.length === 0 || prevAnswer?.length === 0), index: 18 },
      { condition: currentQuestionIndex === 14 && (!emissionsData['selectedPublicTransport'].includes("bus")), index: 16 },
      { condition: currentQuestionIndex === 15 && (!emissionsData['selectedPublicTransport'].includes("jeep") && !emissionsData['selectedPublicTransport'].includes("trike")), index: 18 },
      { condition: currentQuestionIndex === 15 && (!emissionsData['selectedPublicTransport'].includes("jeep")), index: 17 },
      { condition: currentQuestionIndex === 16 && (!emissionsData['selectedPublicTransport'].includes("trike")), index: 18 },
      { condition: currentQuestionIndex === 18 && (currentAnswer === false || prevAnswer === false), index: 22 },
      { condition: currentQuestionIndex === 29 && (currentAnswer === false || prevAnswer === false), index: 32 },
    ];
  
    // Find the first matching condition
    const nextStep = conditions.find(({ condition }) => condition);
  
    // Set the index if a condition matches
    if (nextStep) {
      setCurrentQuestionIndex(nextStep.index);
      return;
    }
  
    // Default behavior: move to the next question
    const skipSteps = 1;
    let newIndex = currentQuestionIndex + skipSteps;
  
    // Ensure the new index does not exceed the number of questions
    if (newIndex < questionDocumentIds.length) {
      setCurrentQuestionIndex(newIndex);
    } else {
      router.push("/(quiz)/QuizEnd");
    }
  };  

  const goToPrevComponent = () => {
    if (currentQuestionIndex === 7){
      if (emissionsData['kmTravelled'] === 0){
        setCurrentQuestionIndex(0);
        return
      }
      if (emissionsData['user'] === "car-sharer"){
        setCurrentQuestionIndex(2);
        return
      }
    }
    if (currentQuestionIndex === 10){
      if (emissionsData['usesTwoWheelers'] === false){
        setCurrentQuestionIndex(7);
        return
      }
    }
    if (currentQuestionIndex === 13){
      const arr = emissionsData['selectedTransports'];
      if (arr.length === 0 || (arraysMatch(arr, ["bike"]))){
        setCurrentQuestionIndex(7);
        return
      }
      if (arr.includes("smallVh")){
        setCurrentQuestionIndex(12);
        return
      }
      else{
        setCurrentQuestionIndex(11);
        return
      }
    }
    if (currentQuestionIndex === 12){
      const arr = emissionsData['selectedTransports'];
      if (arr.includes("eBike")){
        setCurrentQuestionIndex(11);
        return
      }
      else{
        setCurrentQuestionIndex(10);
        return
      }
    }
    if (currentQuestionIndex === 18){
      const arr = emissionsData['selectedPublicTransport'];
      if (arr.length === 0){
        setCurrentQuestionIndex(14);
        return
      }
      else if (arr.includes("trike")){
        setCurrentQuestionIndex(17);
        return
      }
      else if (arr.includes("jeep")){
        setCurrentQuestionIndex(16);
        return
      }
      else if (arr.includes("bus")){
        setCurrentQuestionIndex(15);
        return
      }
    }
    if (currentQuestionIndex === 17){
      const arr = emissionsData['selectedPublicTransport'];
      if (arr.includes("jeep")){
        setCurrentQuestionIndex(16);
        return
      }
      else if (arr.includes("bus")){
        setCurrentQuestionIndex(15);
        return
      }
      else{
        setCurrentQuestionIndex(14);
        return
      }
    }
    if (currentQuestionIndex === 16){
      const arr = emissionsData['selectedPublicTransport'];
      if (arr.includes("bus")){
        setCurrentQuestionIndex(15);
        return
      }
      else {
        setCurrentQuestionIndex(14);
        return
    }}

    if (currentQuestionIndex === 22){
      if (emissionsData['travelledByPlane'] === false){
        setCurrentQuestionIndex(18);
        return
      }
    }

    if (currentQuestionIndex === 32){
      if (emissionsData['usesSolarPanels'] === false){
        setCurrentQuestionIndex(29);
        return
      }
    }

    const newIndex = currentQuestionIndex - 1;
    if (newIndex >= 0) {
      setCurrentQuestionIndex(newIndex);
    } else {
      console.log("No more components");
    }
  };
  
  
  const arraysMatch = (arr1: string[], arr2: string[]) => {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    if (arr1.length !== arr2.length) return false;
    return arr1.every((value, index) => value === arr2[index]);
  };
  
  
  const CurrentComponent = questionData
    ? templates[questionData.template]
    : templates[0];

  // Check quiz status on mount and set up modals
  useEffect(() => {
    const initializeModals = async () => {
      try {
        const quizCompleted = await AsyncStorage.getItem("quizCompleted");
        console.log("Quiz completed status:", quizCompleted); // Debug log

        // Always show Modal1 first
        setShowModal1(true);

        // If quiz was completed before, prepare Modal2 to show after Modal1
        if (quizCompleted === "true") {
          // We'll show Modal2 after Modal1 closes
          setShowModal2(false);
        }
      } catch (error) {
        console.error("Error checking quiz status:", error);
      }
    };

    initializeModals();
  }, []);

  const handleCloseModal1 = () => {
    setShowModal1(false);
    // Only show Modal2 if the value is different from default
    if (emissionsContext?.totalEmissions !== 4.91) {
      setTimeout(() => {
        setShowModal2(true);
      }, 300);
    }
  };

  const handleQuizComplete = async () => {
    try {
      await AsyncStorage.setItem("quizCompleted", "true");
    } catch (error) {
      console.error("Error saving quiz completion status:", error);
    }
  };

  // Check if the value is different from the default 4.91
  const hasCompletedQuiz = emissionsContext?.totalEmissions !== 4.91;

  return (
    <StyledLayout className="flex-1">
      {questionData ? (
        <>
          {loading ? (
            <StyledLayout className="items-center justify-center border flex-1"><ActivityIndicator size={"large"} color={myTheme["color-success-600"]}/></StyledLayout>
          ) : (
            <ScrollView className="max-h-[650px]">
              {questionData.image && (
                <StyledLayout
                  className="bg-white pt-3"
                  style={{
                    borderColor: "white",
                    borderWidth: 1,
                    borderRadius: 40,
                    borderTopEndRadius: 0,
                    borderTopStartRadius: 0,
                    bottom: 7,
                    width: "100%",
                  }}
                >
                  <Image
                    source={{ uri: questionData.image }}
                    style={{
                      width: "70%",
                      aspectRatio: 15 / 5,
                      resizeMode: "contain",
                      alignSelf: "center",
                    }}
                  />
                </StyledLayout>
              )}
              <ScrollView className="pl-4 mr-4 pt-4">
                <CurrentComponent
                  key={questionData.variable}
                  question={questionData.question}
                  choices={questionData.choices}
                  defaultValue={emissionsContext[questionData.variable]}
                  category={questionData.category}
                  inputLabel={questionData.input_label}
                  onAnswer={handleAnswer}
                  steppers={questionData.steppers}
                  isModalVisible={isModalVisible}
                  setModalVisible={setModalVisible}
                  tips={
                    Array.isArray(questionData.tips)
                      ? questionData.tips
                      : questionData.tips
                      ? [questionData.tips]
                      : []
                  }
                />
              </ScrollView>
            </ScrollView>
          )}
          <StyledLayout
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: 16,
              borderTopWidth: 2,
              borderTopColor: myTheme["color-success-900"],
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <NavigationButtons title="Back" onPress={goToPrevComponent} />
              <NavigationButtons title="Next" onPress={goToNextComponent} />
            </View>
          </StyledLayout>

          <TipsModal
            visible={isModalVisible}
            onClose={() => setModalVisible(false)}
            tips={questionData.tips || []}
          />
          <Modal1 visible={showModal1} onClose={handleCloseModal1} />
          {hasCompletedQuiz && ( // Only render Modal2 if not default value
            <Modal2 visible={showModal2} onClose={() => setShowModal2(false)} />
          )}
        </>
      ) : (
        <StyledLayout className="flex-1 justify-center items-center">
          <ActivityIndicator
            size="large"
            color={myTheme["color-success-700"]}
          />
        </StyledLayout>
      )}
    </StyledLayout>
  );
};

export default QuizIndex;
