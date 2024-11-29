import { View, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { TitleComponent } from "@/components/Title";
import { useUserContext } from "@/contexts/UserContext";
import { Layout, Text } from "@ui-kitten/components";
import { styled } from "nativewind";
import { myTheme } from "@/constants/custom-theme";
import { useLoadFonts } from '@/assets/fonts/loadFonts';

const StyledLayout = styled(Layout);
const StyledText = styled(Text);


export default function Index() {
  const { role } = useUserContext();
  const fontsLoaded = useLoadFonts();

  if (!fontsLoaded || role) {
    return null;
  }

  return (
    <StyledLayout style={{ flex: 1, justifyContent: "center", bottom: 0 }}>
      <StyledLayout style={{bottom: 130}}>
        <TitleComponent />
      </StyledLayout>

      <StyledLayout style={{ width: '100%', paddingHorizontal: 35, top: 70}}>
        <TouchableOpacity
          style={{ 
            marginVertical: 8,
            borderRadius: 12,
            backgroundColor: myTheme['color-success-700'],
            padding: 10,
            alignItems: 'center',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5
          }}
          onPress={() => router.push("/login")}
        >
          <StyledText style={{
            fontFamily: 'Poppins-Medium',
            color: 'white',
            fontSize: 14,
            top: 2
          }}>
            Log In
          </StyledText>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ 
            marginVertical: 8,
            borderRadius: 12,
            backgroundColor: myTheme['color-success-700'],
            padding: 10,
            alignItems: 'center',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5
          }}
          onPress={() => router.push("/sign_up")}
        >
          <StyledText style={{
            fontFamily: 'Poppins-Medium',
            color: 'white',
            fontSize: 14,
            top: 2
          }}>
            Sign Up
          </StyledText>
        </TouchableOpacity>
      </StyledLayout>
    </StyledLayout>
  );
}
