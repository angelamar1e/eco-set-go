
import React, { useEffect, useState } from "react";
import { styled } from "nativewind";
import { Button, Text, Card, Layout, Avatar } from '@ui-kitten/components';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import firestore from "@react-native-firebase/firestore";
import { useUserContext } from "@/contexts/UserContext";

const StyledButton = styled(Button);
const StyledText = styled(Text);
const StyledCard = styled(Card);
const StyledLayout = styled(Layout);

const UserProfile = () => {
    const router = useRouter();
    const { username, userUid } = useUserContext();

    const [points, setPoints] = useState<string>("0");
    const [level, setLevel] = useState<string>("1");

    return (
        <StyledLayout className="p-4 flex-1">
            <StyledLayout className=" mt-5 flex-row p-1 justify-between">
                <StyledButton
                    onPress={() => router.push('/(tabs)/Home')}
                    className="p-1 m-1 rounded-full"
                    size="small"
                    appearance="outline"
                    status="basic">
                    <Ionicons name="chevron-back-outline"></Ionicons>
                </StyledButton>
                <StyledButton
                    className="p-1 m-1 rounded-full"
                    onPress={() => {
                        console.log("Navigating to settings");
                        router.push('/Profile/Settings/setting')}}                     
                    size="small"
                    appearance="outline"
                    status="basic">
                    <Ionicons name="settings"></Ionicons>
                </StyledButton>
            </StyledLayout>

            <StyledLayout className="flex-row items-center mt-5">
                <Avatar
                    source={{ uri: "https://via.placeholder.com/150" }}
                    style={{ width: 100, height: 100, marginRight: 16 }}
                />
                <StyledLayout className="items-left mt-4">
                    <StyledText category="h6">Name</StyledText>
                    <StyledText category="s1">@{username}</StyledText>
                    <Ionicons name="time"><StyledText>  Joined (date)</StyledText></Ionicons>
                </StyledLayout>
                
            </StyledLayout>

            <StyledLayout className="flex-row items-center mt-5 mb-5 p-1">
                <StyledCard className="flex-1 m-1">
                    <StyledLayout className="flex-row items-center justify-between">
                        <Ionicons name="star" size={20} color="gold" />
                        <StyledLayout>
                            <StyledText category="p2" className="font-bold">{points}</StyledText>
                            <StyledText category="p2">Eco Points</StyledText>
                        </StyledLayout>
                    </StyledLayout>
                </StyledCard>
                
                <StyledCard className="flex-1 m-1">
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
                    className="mb-5 items-center" 
                    onPress={() => router.push('/(quiz)')}
                    appearance="filled"
                    status="primary"
                >
                    <StyledText category="p1" className="font-bold flex-grow">Calculate your carbon footprint </StyledText>
                    
                </StyledButton>
            </StyledLayout>
        </StyledLayout>
    );
};

export default UserProfile;
