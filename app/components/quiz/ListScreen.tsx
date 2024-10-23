import React from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import { useNavigation } from 'expo-router';
import QuestionList from '../../(quiz)/QuestionList';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

function ListHeader() {
  const navigation = useNavigation();

  return (
    <View className="h-1/8 bg-white border-b border-stone-300 flex-row pl-5">
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={35} color="#78716C" 
          style={{ flex: 1, alignItems: 'center', paddingTop: 20, paddingRight: 5 }}
        />
      </TouchableOpacity>

      <ThemedText type='defaultSemiBold' className="text-4xl text-stone-600 items-center flex-1 p-4 mt-2">
        All Questions
      </ThemedText>
    </View>
  );
}

function QuestionListScreen() {
  return (
    <SafeAreaView className="flex-1 pt-10">
      <ListHeader />
      <QuestionList />
    </SafeAreaView>
  );
}

export default QuestionListScreen;
