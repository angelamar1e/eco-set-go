import React, { FC } from 'react';
import { Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, useTheme } from '@ui-kitten/components';
import { myTheme } from '@/constants/custom-theme';

interface CheckboxProps {
  title: string;
  example?: string;
  isChecked: boolean;
  onPress: () => void;
}

const CheckboxChoices: FC<CheckboxProps> = ({ title, example, isChecked, onPress }) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        marginVertical: 4,
        marginHorizontal: 4,
        padding: 16,
        width: '100%',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: isChecked ? myTheme['color-primary-500'] : myTheme['color-basic-400'],
        borderWidth: isChecked ? 2 : 1,
      }}
    >
      <MaterialIcons
        name={isChecked ? 'check-box' : 'check-box-outline-blank'}
        size={24}
        color={isChecked ? theme['color-primary-500'] : theme['color-basic-600']}
      />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text 
          style={{ 
            fontFamily: 'Poppins-Medium',
            fontSize: 15,
            color: myTheme['color-basic-800'],
            top: 2
          }}
        >
          {title}
        </Text>

        {example && (
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 12,
              color: theme['color-basic-600'],
            }}
          >
            {example}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

export default CheckboxChoices;