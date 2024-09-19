import { CTAButton } from '@/components/CTAButton';
import { View, Text, StyleSheet } from 'react-native';
import { handleLogOut } from '../utils';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Eco Articles</Text>
      <CTAButton title='Log Out' onPress={handleLogOut} variant='primary'/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
