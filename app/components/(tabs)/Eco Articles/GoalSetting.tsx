import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Layout, Card } from '@ui-kitten/components';
import { styled } from 'nativewind';

const StyledLayout = styled(Layout);
const StyledText = styled(Text);

const GoalSetting = () => {
  return (
    <StyledLayout className="flex-1 p-4">
      <StyledText category="h4" className="text-center mb-4">
        Goal Setting for a Greener Life
      </StyledText>
      <ScrollView>
        <Card style={styles.card}>
          <StyledText category="s1" className="mb-2">
            Why Set Eco-Friendly Goals?
          </StyledText>
          <StyledText className="text-justify">
            Setting specific goals helps you stay committed and track your journey towards a sustainable 
            lifestyle. Every eco-friendly action, no matter how small, contributes to a healthier planet.
          </StyledText>
        </Card>
        
        <Card style={styles.card}>
          <StyledText category="s1" className="mb-2">
            How to Set Goals
          </StyledText>
          <StyledText className="text-justify">
            Start by choosing one or two actions that are manageable for you. Set realistic, measurable 
            goals, such as reducing plastic use by 50% or biking to work once a week. These goals will 
            keep you motivated and on track.
          </StyledText>
        </Card>
        
        <Card style={styles.card}>
          <StyledText category="s1" className="mb-2">
            Tracking Your Progress
          </StyledText>
          <StyledText className="text-justify">
            Use our tracking feature to monitor your eco-actions. By reflecting on your progress, you can 
            see the impact of your efforts and identify areas for improvement. Let’s work together towards 
            lasting change.
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

export default GoalSetting;
