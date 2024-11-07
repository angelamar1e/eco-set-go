import React, { useEffect, useState } from "react";
import { styled } from "nativewind";
import { Button, Text, Card, Layout } from '@ui-kitten/components';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { useUserContext } from "@/contexts/UserContext";
import { View } from 'react-native';
import { myTheme } from "@/constants/custom-theme";

// Create a function to generate a random color
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const StyledButton = styled(Button);
const StyledText = styled(Text);
const StyledCard = styled(Card);
const StyledLayout = styled(Layout);

// Helper function to extract initials
const getInitials = (name: string) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
        return nameParts[0][0] + nameParts[1][0];
    } else {
        return nameParts[0][0];
    }
};

const UserProfile = () => {
    const router = useRouter();
    const { username, userUid, joinDate } = useUserContext();

    const [points, setPoints] = useState<string>("0");
    const [level, setLevel] = useState<string>("1");

    const initials = getInitials(username);
    const [avatarColor, setAvatarColor] = useState(getRandomColor()); // Set avatar random color

    useEffect(() => {
        // Generate a new random color whenever the component mounts
        setAvatarColor(getRandomColor());
    }, []);

    return (
        <StyledLayout className="p-4 flex-1">
            <StyledLayout className="mt-5 flex-row p-1 justify-between">
                <StyledButton
                    onPress={() => router.push('/(tabs)/Home')}
                    className="p-1 m-1 rounded-full"
                    size="small"
                    appearance="outline"
                    status="basic">
                    <Ionicons name="chevron-back-outline" />
                </StyledButton>
                <StyledButton
                    className="p-1 m-1 rounded-full"
                    onPress={() => {
                        console.log("Navigating to settings");
                        router.push('/Profile/Settings/setting')
                    }}                     
                    size="small"
                    appearance="outline"
                    status="basic">
                    <Ionicons name="settings" />
                </StyledButton>
            </StyledLayout>

            <StyledLayout className="flex-row items-center mt-5">
                <View className="w-24 h-24 rounded-full justify-center items-center mr-4" 
                    style={{ 
                        backgroundColor: avatarColor, 
                        borderColor: myTheme['color-basic-500'], 
                        borderWidth: 1 
                        }}
                    >
                    <Text className="" style={{ fontSize: 40 }}>{initials}</Text>
                </View>
                <StyledLayout className="items-left mt-4">
                    <StyledText style={{ fontFamily:'Poppins-Medium', fontSize: 22 }}>@{username}</StyledText>
                    <View className="flex-row items-center">
                        <Ionicons name="time" color='#8F9BB3' size={14} />
                        <StyledText style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: myTheme['color-basic-600'], marginLeft: 4, alignItems: 'center'}}>
                            Joined {new Date(joinDate).toLocaleDateString()}
                        </StyledText>
                    </View>
                </StyledLayout>
            </StyledLayout>

            <StyledLayout className="flex-row items-center mt-5 mb-5 p-1">
                <StyledCard className="flex-1 m-1 rounded-xl">
                    <StyledLayout className="flex-row items-center justify-between">
                        <Ionicons name="star" size={20} color="gold" />
                        <StyledLayout>
                            <StyledText category="p2" className="font-bold">{points}</StyledText>
                            <StyledText category="p2">Eco Points</StyledText>
                        </StyledLayout>
                    </StyledLayout>
                </StyledCard>
                
                <StyledCard className="flex-1 m-1 rounded-xl">
                    <StyledLayout className="flex-row items-center justify-between">
                        <Ionicons name="arrow-up-outline" size={20} color="green" />
                        <StyledLayout>
                            <StyledText category="p2" className="font-bold">{level}</StyledText>
                            <StyledText category="p2">Eco Level</StyledText>
                        </StyledLayout>
                    </StyledLayout>
                </StyledCard>
            </StyledLayout>

            <StyledLayout className="p-2">
                <StyledButton
                    className="mb-5 items-center rounded-xl" 
                    onPress={() => router.push('/(quiz)')}
                    appearance="filled"
                    status="primary"
                >
                    <StyledText category="p1" className="font-bold flex-grow">Calculate your carbon footprint</StyledText>
                </StyledButton>
            </StyledLayout>
        </StyledLayout>
    );
};

export default UserProfile;
