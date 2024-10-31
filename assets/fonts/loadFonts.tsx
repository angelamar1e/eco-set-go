// loadFonts.js
import * as Font from 'expo-font';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_400Regular_Italic,
  useFonts,
} from '@expo-google-fonts/poppins';

// Function to load the fonts
export const loadFonts = async () => {
  await Font.loadAsync({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
    'Poppins-Italic': Poppins_400Regular_Italic,
  });
};

// Custom hook for loading fonts
export const useLoadFonts = () => {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
    'Poppins-Italic': Poppins_400Regular_Italic,
  });
  return fontsLoaded;
};
