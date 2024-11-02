import React, { useState } from 'react';
import { styled } from 'nativewind';
import { Layout, Input, Button, Text } from '@ui-kitten/components';
import { createReflection } from '@/app/utils/reflectionUtils';
import { useNavigation } from '@react-navigation/native';
import { useUserContext } from '@/contexts/UserContext';

const StyledLayout = styled(Layout);
const StyledInput = styled(Input);

const CreateReflection = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigation = useNavigation();
  const { userUid } = useUserContext(); // Access user UID

  const handleCreateReflection = async () => {
    await createReflection({ content, date: new Date().toISOString(), uid: userUid });
    navigation.goBack(); // Navigate back after creating
  };

  return (
    <StyledLayout className="p-4">
      <StyledInput
        placeholder="Reflection Content"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <Button onPress={handleCreateReflection}>Create Reflection</Button>
    </StyledLayout>
  );
};

export default CreateReflection;
