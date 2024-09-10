import React, {useState, useEffect} from 'react';
import auth from "@react-native-firebase/auth";
import db, { FirebaseDatabaseTypes } from "@react-native-firebase/database";

import { BackHandler, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function LandingPageScreen() {
  const [overallFP, setOverallFP] = useState<number | undefined>();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  useEffect(() => {
    const backAction = () => {
      if (Platform.OS === 'android') {
        BackHandler.exitApp();
        return true; // Indicate that the back button press is handled
      }
      return false; // Default behavior for other platforms
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

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
    <View style={styles.container}>
      <StatusBar style="auto" />

      <ThemedView>
        <ThemedText type='title'>Welcome!</ThemedText>
      </ThemedView>
      
      <View style={styles.rectangle}>
        <ThemedText type='subtitle'>Carbon Footprint</ThemedText>
        <ThemedText type='subtitle'>{overallFP}</ThemedText>
      </View>

      <View style={styles.columns}>
        <View style={styles.square}>
          <Text>22g</Text>
          <Text>less than initial record</Text>
        </View>

        <View style={styles.square}>
          <Text>26%</Text>
          <Text>of goal completed</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: useThemeColor({},'background'),
    padding: 40,
    alignItems: 'center',
    flexDirection: 'column'
  },

  header: {
    paddingVertical: 15,
    width: '90%',
    alignItems: 'flex-start',
    marginTop: 20,
  }, 

  columns: {
    flexDirection: 'row',
    // justifycontent: 'center',
    width: '100%',
    height: '20%'
  },

  rectangle: {
    padding: 15,
    width: '30%',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // alignitems: 'flex-start',
    marginBottom: 20,
  },

  square: {
    // alignitems: 'center',
    justifyContent: 'center',
    width: '45%',
    height: '100%',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: 8,
    padding: 15,
  },

  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    color: '#036B00',
    marginBottom: 5,
  },

  subheading1: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#0D0D0D',
    marginBottom: 5,
  },
  
  subheading2: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#0D0D0D',
    marginBottom: 5,
  },  
  
  text: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#0D0D0D',
    marginBottom: 5,
  },

});