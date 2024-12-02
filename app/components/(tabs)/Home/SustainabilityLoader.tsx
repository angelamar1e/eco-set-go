import React, { FC, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

const sustainabilityPhrases = [
    "Sorting recyclables... blue bin or green?",
    "Composting bad ideas, growing better ones...",
    "Pedaling harder... the app runs on clean energy.",
    "Swapping plastic for reusable code...",
    "Riding a bike to the data center...",
    "Turning off unnecessary tabs... like lights!",
    "Picking up litter on the information highway.",
    "Charging on solar power—almost ready!",
    "Collecting rainwater for your eco-insights.",
    "Planting trees... one digital leaf at a time.",
];

const SustainabilityLoader: FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const cyclePhrases = () => {
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        // Hold the phrase for a while
        setTimeout(() => {
          // Fade out
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            // Move to the next phrase
            setCurrentIndex((prevIndex) =>
              prevIndex === sustainabilityPhrases.length - 1 ? 0 : prevIndex + 1
            );
          });
        }, 1500); // Display time for each phrase
      });
    };

    cyclePhrases();

    const interval = setInterval(cyclePhrases, 4000); // Total animation time (fade in + hold + fade out)
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [currentIndex]);

  return (
      <Animated.Text style={[styles.phrase, { opacity: fadeAnim }]}>
        {sustainabilityPhrases[currentIndex]}
      </Animated.Text>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f3",
  },
  phrase: {
    marginTop: 50,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 20,
    color: "#2b7a78",
  },
});

export default SustainabilityLoader;
