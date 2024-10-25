import React from "react";
import { styled } from "nativewind";
import { Button, Text, Card, Layout, Avatar } from '@ui-kitten/components';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';

const StyledButton = styled(Button);
const StyledText = styled(Text);
const StyledCard = styled(Card);
const StyledLayout = styled(Layout);

const Settings: React.FC = () => {
    const router = useRouter();

    return (
        <StyledLayout className="p-4">
            <StyledLayout className="p-1 justify-end">
                <StyledButton
                    onPress={() => router.push('/(tabs)/Profile/settings')}
                    className="p-1 m-1"
                    size="small"
                    appearance="outline"
                    status="basic">
                    <StyledText category="s1" className="text-center">Settings</StyledText>
                </StyledButton>
            </StyledLayout>

            <StyledLayout className="p-1 justify-end">
                <StyledButton
                    className="p-1 m-1"
                    size="small"
                    appearance="outline"
                    status="basic">
                    <StyledText category="s1" className="text-center">Log Out</StyledText>
                </StyledButton>
            </StyledLayout>
        </StyledLayout>
    );
};

export default Settings;
