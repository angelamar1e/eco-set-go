import React, { useEffect, useState } from "react";
import { styled } from "nativewind";
import { Button, Text, Card, Layout, Avatar } from '@ui-kitten/components';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import firestore from "@react-native-firebase/firestore";
import { getUserUid } from "../../utils/utils";

const StyledButton = styled(Button);
const StyledText = styled(Text);
const StyledCard = styled(Card);
const StyledLayout = styled(Layout);

interface UserProfileProps {
    onSettingsPress: () => void;
    onQuizCardPress: () => void;
    points: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ onSettingsPress, onQuizCardPress, points }) => {
    const router = useRouter();
    const [userName, setUserName] = useState<string | undefined>();

    // Function to get the username from Firestore
    const fetchUserName = async (userUid: string) => {
        try {
            const userDoc = await firestore().collection('users').doc(userUid).get();
            if (userDoc.exists) {
                setUserName(userDoc.data()?.username);
            }
        } catch (error) {
            console.error("Error fetching username: ", error);
        }
    };

    useEffect(() => {
        const fetchUserUid = async () => {
            const uid = await getUserUid(); 
            fetchUserName(uid);
        };

        fetchUserUid();
    }, []);

    return (
        <StyledLayout className="p-4">
            <StyledLayout className="flex-row justify-end mb-4">
                <StyledButton
                    onPress={() => router.push('/(tabs)/Home')}
                    appearance="outline"
                    status="primary"
                    className="p-1 rounded-full bg-white"
                >
                    <Ionicons name="chevron-back-outline" size={24} />
                </StyledButton>
                <StyledButton
                    onPress={onSettingsPress}
                    appearance="outline"
                    status="primary"
                    className="p-1 rounded-full bg-white"
                >
                    <Ionicons name="settings" size={24} />
                </StyledButton>
            </StyledLayout>

            <StyledLayout className="justify-center items-center mb-4">
                <StyledLayout className="flex-1 items-center mb-2">
                    {/*user image */}
                    <Avatar
                        source={{ uri: "https://via.placeholder.com/150" }}
                        style={{ width: 100, height: 100 }}
                    />
                </StyledLayout>
                <StyledLayout className="flex-1">
                    {/* username */}
                    <StyledText category="h6">
                        {userName}
                    </StyledText>
                </StyledLayout>
            </StyledLayout>

            <StyledCard className="p-4">
                {/* Display user points */}
                <StyledText category="s1">{points}</StyledText>
                <StyledText category="p1">Points</StyledText>
            </StyledCard>

            <StyledCard
            onPress={onQuizCardPress}
            appearance="outline"
            status="primary"
            className="p-1 rounded-full bg-white">
                <StyledText>Calculate your carbon footprint</StyledText>

            </StyledCard>
        </StyledLayout>
    );
};

export default UserProfile;
