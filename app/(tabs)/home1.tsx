import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Platform, View, Text } from "react-native";
import auth from "@react-native-firebase/auth";
import db, { FirebaseDatabaseTypes } from "@react-native-firebase/database";

export default function HomeScreen() {
  const [overallFP, setOverallFP] = useState<number | undefined>();

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
    <View>
      <Text>{overallFP}</Text>
    </View>
  );
}
