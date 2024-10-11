import React, { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { getUserUid } from "@/app/utils/utils";
import moment from "moment";

interface ImpactCalculatorProps {
    onImpactUpdate: (impact: number) => void; // Callback function to send impact to the parent
  }

  const ImpactCalculator: React.FC<ImpactCalculatorProps> = ({ onImpactUpdate }) => {
  const [userUid, setUserUid] = useState<string | undefined>();
  const [totalImpact, setTotalImpact] = useState<number>(0); // Total impact from logged actions
  const [baseFootprint, setBaseFootprint] = useState<number>(0); // Base footprint from Firestore

  // Get User ID and base footprint on Component Mount
  useEffect(() => {
    const fetchUserUidAndFootprint = async () => {
      const uid = await getUserUid();
      setUserUid(uid);
      if (uid) {
        fetchBaseFootprint(uid); // Fetch base footprint when UID is available
        setupLogsListener(uid);  // Setup logs listener once userUid is available
      }
    };
    fetchUserUidAndFootprint();
  }, []);

  // Fetch base footprint from Firestore
  const fetchBaseFootprint = async (uid: string) => {
    try {
      const footprintDoc = await firestore().collection('current_footprint').doc(uid).get();
      if (footprintDoc.exists) {
        const data = footprintDoc.data();
        setBaseFootprint(data?.overall_footprint || 0); // Set base footprint

      }
    } catch (error) {
      console.error("Error fetching base footprint:", error);
    }
  };

  // Setup real-time listener for user logs once userUid is available
  const setupLogsListener = (uid: string) => {
    const userLogsRef = firestore().collection("user_logs").doc(uid);

    const unsubscribe = userLogsRef.onSnapshot((doc) => {
      const data = doc.data();
      const currentDate = moment().format("MM-DD-yy");
      const loggedActions = data?.[currentDate] || [];

      calculateTotalImpact(loggedActions); // Track and update impact based on real-time logs
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  };

  // Calculate Total Impact based on logged actions
  const calculateTotalImpact = async (actionIds: string[]) => {
    if (actionIds.length == 0){
        updateFootprint(0);
        onImpactUpdate(0);
        return;
    }

    try {
      const actionCollection = firestore().collection("eco_actions");
      const actionQuery = await actionCollection.where(firestore.FieldPath.documentId(), "in", actionIds).get();

      const impacts = actionQuery.docs.map((doc) => doc.data().impact || 0);
      const currentTotalImpact = impacts.reduce((acc, impact) => acc + impact, 0);
      console.log(`Current total impact: ${currentTotalImpact}`);
      updateFootprint(currentTotalImpact); // Update footprint with current total impact
      onImpactUpdate(currentTotalImpact);

    } catch (error) {
      console.error("Error calculating total impact:", error);
    }
  };

  // Update Footprint Logic (only update DB, not local state)
  const updateFootprint = async (currentTotalImpact: number) => {
    // if (!userUid) return;

    const newFootprint = calculateNewFootprint(currentTotalImpact);

    try {
      // Check if the document exists before trying to update it
      const footprintRef = firestore().collection("current_footprint").doc(userUid);
      const doc = await footprintRef.get();

      if (doc.exists) {
        // Document exists, proceed with update
        await footprintRef.update({ overall_footprint: newFootprint });
        console.log(`Updated footprint to: ${newFootprint}`);
      }
    } catch (error) {
      console.error("Error updating footprint:", error);
    }
  };

  // Calculate the new footprint to update in Firestore
  const calculateNewFootprint = (currentTotalImpact: number) => {
    // If no actions logged, reset to base footprint
    if (currentTotalImpact == 0) {
      return baseFootprint; // Reset to base footprint when no actions
    }
    else {
        // Adjust footprint based on current impact
        return baseFootprint - (currentTotalImpact / 1000000); // Modify this logic as per your calculation needs
    }
  };

  return null; // No rendering needed for this component
};

export default ImpactCalculator;
