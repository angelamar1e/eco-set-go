import { getUserUid } from "@/app/utils/utils";
import React, { FC, useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { Text } from "react-native-paper";

interface CalculatorProps {
  value: number; // Current numeric value from Question1
}

const Calculator: React.FC<CalculatorProps> = ({ value }) => {
  const [overallFootprint, setOverallFootprint] = useState<number>(0);
  const [userUid, setUserUid] = useState<string | undefined>();
  const [lastValue, setLastValue] = useState<number>(0);

  useEffect(() => {
    const fetchUserUid = async () => {
      const uid = await getUserUid();
      setUserUid(uid);
    };

    fetchUserUid();
  }, []);

  useEffect(() => {
    const footprintRef = userUid ? firestore().collection("current_footprint").doc(userUid) : null;

    if (footprintRef) {
      const unsubscribe = footprintRef.onSnapshot((doc) => {
        if (doc.exists) {
          setOverallFootprint(doc.data()!.overall_footprint || 0);
        }
      });

      return () => unsubscribe();
    }
  }, [userUid]);

  useEffect(() => {
    // Update overall footprint: Reverse last change, then apply new change
    setOverallFootprint((prev) => {
        const newFootprint = (prev - lastValue) + (value / 907.185); // Calculate new footprint
        // Update Firestore with the new footprint
        if (userUid) {
          firestore().collection("current_footprint").doc(userUid).update({ overall_footprint: newFootprint });
        }
  
        setLastValue(value / 907.185); // Update lastValue to the new input
        return newFootprint; // Return the new footprint for state
      });
    }, [value]);

  return (
    <Text className="mt-8 ml-3 text-3xl text-lime-800">{overallFootprint.toFixed(2)} <Text className="text-lime-800 text-2xl">tons of CO2e</Text></Text>
  );
};

export default Calculator;
