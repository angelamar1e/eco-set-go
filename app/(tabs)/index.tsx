import React, { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import db, { FirebaseDatabaseTypes } from "@react-native-firebase/database";

import { BackHandler, Platform, View } from "react-native";
import { Text } from "react-native-paper";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function LandingPageScreen() {
  const [overallFP, setOverallFP] = useState<number | undefined>();

  useEffect(() => {
    const backAction = () => {
      if (Platform.OS === "android") {
        BackHandler.exitApp();
        return true; // Indicate that the back button press is handled
      }
      return false; // Default behavior for other platforms
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Cleanup function
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const currentUser = auth().currentUser!;
    const refPath = `/current_footprint/${currentUser.uid}/overall_footprint`;

    db()
      .ref(refPath)
      .on("value", (snapshot) => {
        if (snapshot.exists()) {
          const value = snapshot.val();
          setOverallFP(value);
        }
      });

    return () => db().ref(refPath).off();
  });

  return (
    <View className="flex-1 mt-5">
      <Text variant="headlineSmall">
        Welcome, <Text className="italic">user!</Text>
      </Text>
      <View className="flex-row">
        
      </View>
    </View>
  );
}
