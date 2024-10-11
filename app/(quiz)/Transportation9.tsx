import React, { FC, useContext } from "react";
import Template2 from "../components/quiz/Template2";
import { ThemedView } from "@/components/ThemedView";
import { EmissionsContext } from "@/contexts/EmissionsContext";
import { QuestionProps } from "@/types/QuizProps";
import { TransportEmission } from "@/constants/DefaultValues";

const Transportation9: FC<QuestionProps> = ({ question, choices }) => {
  const category = "Transportation";
  const unit = "hrs";

  const { setShortHaul } = useContext(EmissionsContext);

  const updateFlightDuration = (newDuration: string | number) => {
    setShortHaul((prevShortHaul: any) => ({
      ...prevShortHaul, // Spread the previous state to keep other properties unchanged
      flightDuration: newDuration, // Update only the flightDuration
    }));
  };

  return (
    <ThemedView className="px-4">
      <Template2
        category={category}
        question={question}
        choices={choices}
        defaultValue={TransportEmission.Airplane.shortHaul.duration}
        onAnswer={updateFlightDuration}
        unit={unit}
      />
    </ThemedView>
  );
};

export default Transportation9;
