import React from 'react';
import { TextInput, View} from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';

type InputField = {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry ?: boolean;
    icon: {
        library: 'Feather' | 'FontAwesome'; // Specify the library
        name: string; // Icon name
    };
};

type AuthInputFieldsProps = {
    fields: InputField[];
};

export const AuthInputFields: React.FC<AuthInputFieldsProps> = ({ fields }) => {
    return (
      <View>
        {fields.map((field, index) => (
            <View key={index} className="p-1.5">
              <View>
                {field.placeholder === "Username" ? (
                    <Feather
                      name="user"
                      size={24}
                      style={{ position: 'absolute', left: 16, top: 12, color: '#757575', zIndex: 10 }} 
                    />
                ) : field.placeholder === "Email" ? (
                    <FontAwesome
                      name="envelope-o"
                      size={24}
                      style={{ position: 'absolute', left: 16, top: 12, color: '#757575', zIndex: 10 }}
                    />
                ) : (
                    <Feather
                      name="lock"
                      size={24}
                      style={{ position: 'absolute', left: 16, top: 12, color: '#757575', zIndex: 10 }}
                    />
                )}
                <TextInput
                    className="pl-14 pr-4 py-3 bg-[#F6F5F3] rounded-xl text-[#757575] w-full h-13"
                    placeholder={field.placeholder}
                    value={field.value || ''}
                    onChangeText={field.onChangeText}
                    secureTextEntry={field.secureTextEntry || false}
                />
              </View>
            </View>
        ))}
      </View>
    );
};