import React, { useState } from 'react';
import { TextInput, View} from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';

type FormType = 'login' | 'signup'; 
interface AuthInputFieldsProps {
  formType: FormType;  
}

export const AuthInputFields: React.FC<AuthInputFieldsProps> = ({ formType }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Define fields for sign-up (Username, Email, Password)
  const signUpFields = [
    {
      placeholder: 'Username',
      value: username,
      onChangeText: setUsername,
      secureTextEntry: false,
    },
    {
      placeholder: 'Email',
      value: email,
      onChangeText: setEmail,
      secureTextEntry: false,
    },
    {
      placeholder: 'Password',
      value: password,
      onChangeText: setPassword,
      secureTextEntry: true,
    },
  ];

  // Define fields for login (Email, Password)
  const loginFields = [
    {
      placeholder: 'Email',
      value: email,
      onChangeText: setEmail,
      secureTextEntry: false,
    },
    {
      placeholder: 'Password',
      value: password,
      onChangeText: setPassword,
      secureTextEntry: true,
    },
  ];

  // Use the appropriate fields based on the form type
  const fields = formType === 'login' ? loginFields : signUpFields;

  return (
    <View>
       {fields.map((field, index) => (
          <View key={index} className='py-1.5'>
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
                    className="pl-14 pr-4 py-3 bg-[#F6F5F3] rounded-lg text-[#757575] w-full h-12"
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