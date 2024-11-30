import React, { useEffect, useState, useContext } from "react";
import { styled } from "nativewind";
import { Button, Text, Card, Layout } from '@ui-kitten/components';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { useUserContext } from "@/contexts/UserContext";
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { myTheme } from "@/constants/custom-theme";
import { EmissionsContext } from "@/contexts/Emissions";
import { getHighestEmissions } from '@/contexts/EmissionsData';
import { Levels } from "@/constants/Points";

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

// Add interfaces for type safety
interface Emission {
    category: string;
    value: number;
    percentage?: string;
}

interface HighestEmission {
    value: number;
    source: string;
    percentage: number;
}

interface EmissionsData {
    food: HighestEmission;
    transportation: HighestEmission;
    electricity: HighestEmission;
}

const UserProfile = () => {
    const router = useRouter();
    const { username, userUid, joinDate, initialFootprint, points: userPoints } = useUserContext();
    const {
        foodFootprint,
        transportationFootprint,
        electricityFootprint,
        emissionsData
    } = useContext(EmissionsContext);
    const [currentLevel, setCurrentLevel] = useState<keyof typeof Levels | null>(null);

    const initials = getInitials(username);
    const [avatarColor, setAvatarColor] = useState(getRandomColor());

    const total = initialFootprint;

    // Sort emission categories from highest to lowest
    const sortedEmissions = [
        { category: "Food 🥗", value: foodFootprint },
        { category: "Transportation 🛻", value: transportationFootprint },
        { category: "Electricity ⚡", value: electricityFootprint }
    ].sort((a, b) => b.value - a.value);

    // Initialize highest emissions
    let highestEmissions: EmissionsData = {
        food: { value: 0, source: '', percentage: 0 },
        transportation: { value: 0, source: '', percentage: 0 },
        electricity: { value: 0, source: '', percentage: 0 },
    };

    if (emissionsData) {
        highestEmissions = getHighestEmissions(emissionsData);
        if (total > 0) {
            highestEmissions.food.percentage = Number(((highestEmissions.food.value / total) * 100).toFixed(2));
            highestEmissions.transportation.percentage = Number(((highestEmissions.transportation.value / total) * 100).toFixed(2));
            highestEmissions.electricity.percentage = Number(((highestEmissions.electricity.value / total) * 100).toFixed(2));
        }
    }

    useEffect(() => {
        const calculateLevel = () => {
            const levels = Object.keys(Levels) as Array<keyof typeof Levels>;
            
            for (let i = 0; i < levels.length; i++) {
                const level = levels[i];
                if (Levels[level] >= userPoints) {
                    setCurrentLevel(level);
                    break;
                }
            }
        };

        calculateLevel();
    }, [userPoints]);

    useEffect(() => {
        setAvatarColor(getRandomColor());
    }, []);

    return (
        <ScrollView style={{ backgroundColor: 'white' }}>
            <StyledLayout className="p-4 flex-1">
                {/* Profile Header - simplified */}
                <StyledLayout className="mt-5 flex-row p-1 justify-between">
                    <StyledButton
                        onPress={() => router.push('/(tabs)/Rewards/points')}
                        className="p-1 m-1 rounded-full"
                        size="small"
                        appearance="outline"
                        status="basic">
                        <Ionicons name="chevron-back-outline" />
                    </StyledButton>
                    <StyledButton
                        className="p-1 m-1 rounded-full"
                        onPress={() => router.push('/Profile/Settings')}                     
                        size="small"
                        appearance="outline"
                        status="basic">
                        <Ionicons name="settings" />
                    </StyledButton>
                </StyledLayout>

                {/* Profile Info */}
                <StyledLayout className="flex-row items-center mt-5">
                    <View className="w-24 h-24 rounded-full justify-center items-center mr-4" 
                        style={{ 
                            backgroundColor: avatarColor, 
                        }}
                    >
                        <Text style={{ 
                            fontSize: 40, 
                            color: 'white',
                            fontFamily: 'Poppins-SemiBold' 
                        }}>
                            {initials}
                        </Text>
                    </View>
                    <StyledLayout className="items-left mt-4">
                        <StyledText style={{ 
                            fontFamily: 'Poppins-SemiBold', 
                            fontSize: 22,
                        }}>
                            @{username}
                        </StyledText>
                        <View className="flex-row items-center">
                            <Ionicons name="calendar-outline" color={myTheme['color-basic-600']} size={14} />
                            <StyledText style={{ 
                                fontFamily: 'Poppins-Regular', 
                                fontSize: 14, 
                                color: myTheme['color-basic-600'], 
                                marginLeft: 4
                            }}>
                                Joined {new Date(joinDate).toLocaleDateString()}
                            </StyledText>
                        </View>
                    </StyledLayout>
                </StyledLayout>

                {/* Points and Level Cards - matching theme */}
                <StyledLayout className="flex-row items-center mt-5">
                    <StyledCard 
                        className="flex-1 m-1 rounded-xl"
                        style={{
                            borderColor: myTheme['color-success-900'],
                        }}
                    >
                        <StyledLayout className="flex-row items-center justify-between bg-transparent">
                            <View style={{
                                backgroundColor: myTheme['color-success-transparent-200'],
                                padding: 8,
                                borderRadius: 12,
                            }}>
                                <Ionicons name="star" size={20} color={myTheme['color-success-500']} />
                            </View>
                            <StyledLayout className="bg-transparent">
                                <StyledText style={{ 
                                    fontFamily: 'Poppins-SemiBold',
                                    fontSize: 18,
                                    color: myTheme['color-success-700']
                                }}>
                                    {userPoints}
                                </StyledText>
                                <StyledText style={{ 
                                    fontFamily: 'Poppins-Regular',
                                    color: myTheme['color-success-700']
                                }}>
                                    Eco Points
                                </StyledText>
                            </StyledLayout>
                        </StyledLayout>
                    </StyledCard>
                    
                    <StyledCard 
                        className="flex-1 m-1 rounded-xl"
                        style={{
                            borderColor: myTheme['color-success-900'],
                        }}
                    >
                        <StyledLayout className="flex-row items-center justify-between bg-transparent">
                            <View style={{
                                backgroundColor: myTheme['color-success-transparent-200'],
                                padding: 8,
                                borderRadius: 12,
                            }}>
                                <Ionicons name="trending-up" size={20} color={myTheme['color-success-500']} />
                            </View>
                            <StyledLayout className="bg-transparent">
                                <StyledText style={{ 
                                    fontFamily: 'Poppins-SemiBold',
                                    fontSize: 18,
                                    color: myTheme['color-success-700']
                                }}>
                                    {currentLevel?.toString()}
                                </StyledText>
                                <StyledText style={{ 
                                    fontFamily: 'Poppins-Regular',
                                    color: myTheme['color-success-700']
                                }}>
                                    Eco Level
                                </StyledText>
                            </StyledLayout>
                        </StyledLayout>
                    </StyledCard>
                </StyledLayout>
                
                {/* Recalculate Button */}
                <StyledCard className="px-2 mt-2 mb-2"
                    style={{ 
                        backgroundColor: myTheme['color-success-transparent-100'],
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: myTheme['color-success-900'],
                    }}
                >
                    <TouchableOpacity 
                        onPress={() => router.push('/(quiz)')}
                        activeOpacity={0.7}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons 
                                name="calculator-outline" 
                                size={20} 
                                color={myTheme['color-success-700']} 
                                style={{ marginRight: 8 }}
                            />
                            <Text style={{ 
                                fontFamily: 'Poppins-Medium',
                                color: myTheme['color-success-700'],
                                fontSize: 15,
                                includeFontPadding: false,
                                textAlignVertical: 'center'
                            }}>
                                Calculate Footprint
                            </Text>
                        </View>
                        <Ionicons 
                            name="chevron-forward" 
                            size={20} 
                            color={myTheme['color-success-700']} 
                        />
                    </TouchableOpacity>
                </StyledCard>

                {/* Combined Initial Footprint and Emissions Card */}
                <TouchableOpacity 
                    onPress={() => router.push('/(quiz)/QuizEnd')}
                    activeOpacity={0.7}
                >
                    <StyledCard
                        className='rounded-xl'
                        style={{
                            borderColor: myTheme['color-success-900'],
                            backgroundColor: myTheme['color-success-transparent-100']
                        }}
                    >
                        <StyledLayout className='items-center bg-transparent'>
                            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 23 }}>Your initial footprint</Text>
                            <Text
                                style={{
                                    fontFamily: 'Poppins-Bold',
                                    fontSize: 80,
                                    textAlign: 'center',
                                    color: myTheme['color-success-700']
                                }}
                            >
                                {initialFootprint.toFixed(2)}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: 'Poppins-SemiBold',
                                    fontSize: 23,
                                    textAlign: 'center',
                                }}
                            >
                                tons
                            </Text>
                            <Text
                                style={{
                                    fontFamily: 'Poppins-Regular',
                                    fontSize: 15,
                                    textAlign: 'center',
                                }}
                            >
                                of CO₂e per year
                            </Text>
                        </StyledLayout>

                        {/* Divider */}
                        <View 
                            style={{ 
                                height: 1.5, 
                                width: '100%', 
                                backgroundColor: myTheme['color-success-700'],
                                opacity: 0.15,
                                marginVertical: 15
                            }} 
                        />

                        {/* Emissions by Category Section */}
                        <StyledLayout className='w-full bg-transparent'>
                            {/* Mapped sorted emissions */}
                            {sortedEmissions.map((emission, index) => (
                                <StyledLayout 
                                    key={index} 
                                    className='flex-row justify-between items-center bg-transparent'
                                    style={{ 
                                        marginBottom: index !== sortedEmissions.length - 1 ? 15 : 20,
                                        paddingHorizontal: 5
                                    }}
                                >
                                    <Text style={{ 
                                        fontFamily: 'Poppins-Medium', 
                                        fontSize: 17,
                                        opacity: 0.85
                                    }}>
                                        {emission.category}
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <Text style={{ 
                                            fontFamily: 'Poppins-SemiBold', 
                                            fontSize: 17,
                                            color: myTheme['color-success-700']
                                        }}>
                                            {emission.value.toFixed(2)}
                                        </Text>
                                        <Text style={{ 
                                            fontFamily: 'Poppins-Regular', 
                                            fontSize: 15,
                                            color: myTheme['color-success-700'],
                                            marginLeft: 4
                                        }}>
                                            tons
                                        </Text>
                                    </View>
                                </StyledLayout>
                            ))}

                            {/* View Details Link */}
                            <TouchableOpacity 
                                onPress={() => router.push('/(quiz)/QuizEnd')}
                                style={{ 
                                    flexDirection: 'row', 
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: 5,
                                    padding: 8,
                                    backgroundColor: myTheme['color-success-transparent-200'],
                                    borderRadius: 8
                                }}
                            >
                                <Text style={{ 
                                    fontFamily: 'Poppins-Medium', 
                                    fontSize: 14,
                                    color: myTheme['color-success-900']
                                }}>
                                    View detailed breakdown
                                </Text>
                            </TouchableOpacity>
                        </StyledLayout>
                    </StyledCard>
                </TouchableOpacity>
            </StyledLayout>
        </ScrollView>
    );
};

export default UserProfile;
