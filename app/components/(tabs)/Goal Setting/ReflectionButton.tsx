import React, { useState } from 'react';
import { styled } from 'nativewind';
import { Button, Layout } from '@ui-kitten/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const StyledButton = styled(Button);
const StyledLayout = styled(Layout);

const ReflectionButton = () => {
  const [isClicked, setIsClicked] = useState(false);
  const router = useRouter();

  const handlePress = () => {
    setIsClicked(!isClicked);
    router.push('/components(tabs)Goal SettingCreateReflection')
  };

  return (
    <StyledLayout>
      <StyledButton
        className='m-1 p-1 rounded-full'
        status={isClicked ? 'success' : 'basic'}
        size='small'
        appearance={isClicked ? "filled" : "outline"}
        accessoryLeft={() => (
          <Ionicons name="pencil" size={20} color="#8F9BB3" />
        )}
        onPress={handlePress}
      >
      </StyledButton>
    </StyledLayout>
  );
};

export default ReflectionButton;
