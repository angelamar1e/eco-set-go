import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Layout, Card } from '@ui-kitten/components';
import { styled } from 'nativewind';

const StyledLayout = styled(Layout);
const StyledText = styled(Text);

const Introduction = () => {
  return (
    <StyledLayout className="flex-1 p-4">
      <StyledText category="h4" className="text-center mb-4">
        Welcome to Eco Actions
      </StyledText>
      <ScrollView>
        <Card style={styles.card}>
          <StyledText category="s1" className="mb-2">
            Purpose
          </StyledText>
          <StyledText className="text-justify">
            Eco Actions is your guide to making impactful environmental changes in your everyday life. 
            We believe that small, conscious steps taken by each individual can make a significant 
            difference in the health of our planet.
          </StyledText>
        </Card>
        
        <Card style={styles.card}>
          <StyledText category="s1" className="mb-2">
            Benefits
          </StyledText>
          <StyledText className="text-justify">
            Discover eco-friendly practices, track your progress, and connect with a community 
            dedicated to sustainability. By participating, you not only reduce your carbon footprint 
            but also inspire others to take action.
          </StyledText>
        </Card>
        
        <Card style={styles.card}>
          <StyledText category="s1" className="mb-2">
            How to Get Started
          </StyledText>
          <StyledText className="text-justify">
            Navigate through our categories, explore various eco-actions, and select the ones that align 
            with your values and lifestyle. Let’s start building a greener future together!
          </StyledText>
        </Card>
      </ScrollView>
    </StyledLayout>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 16,
  },
});

export default Introduction;
