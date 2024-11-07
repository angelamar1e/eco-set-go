import { EmissionsDataContext, getHighestEmissions } from '@/contexts/EmissionsData';
import { useUserContext } from '@/contexts/UserContext';
import firestore from '@react-native-firebase/firestore';
import { Layout, Text, Button, Card } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { myTheme } from '@/constants/custom-theme';
import { EmissionsContext } from '@/contexts/Emissions';
import { EmissionsData } from '../../constants/DefaultValues';

const StyledLayout = styled(Layout);
const StyledCard = styled(Card);

const QuizEnd = () => {
    const {
        foodFootprint,
        transportationFootprint,
        electricityFootprint,
    } = useContext(EmissionsContext);

    const {initialFootprint} = useUserContext();

    // Prepare an array with each category and its value, then sort it from highest to lowest
    const sortedEmissions = [
        { category: "Food 🥗", value: foodFootprint },
        { category: "Transportation 🛻", value: transportationFootprint },
        { category: "Electricity ⚡", value: electricityFootprint }
    ].sort((a, b) => b.value - a.value); 

    const maxWidth = 100; 
    const minWidth = 70;

    const widthDecrement = (maxWidth - minWidth) / (sortedEmissions.length - 1);

    const total = initialFootprint;

    // Calculate percentages for each category
    const percentageEmissions = sortedEmissions.map(emission => ({
        ...emission,
        percentage: ((Number(emission.value) / total) * 100).toFixed(2) // Ensure emission.value is a number
    }));

    const { emissionsData } = useContext(EmissionsContext);
    let highestEmissions = {
        food: { value: 0, source: '', percentage: 0 },
        transportation: { value: 0, source: '', percentage: 0 },
        electricity: { value: 0, source: '', percentage: 0 },
    };

    let foodCategory, transportationCategory, electricityCategory;

    if (emissionsData) {
        highestEmissions = getHighestEmissions(emissionsData);
        // Calculate the contribution percentage for the top contributors
        if (total > 0) {
            highestEmissions.food.percentage = Number(((highestEmissions.food.value / total) * 100).toFixed(2));
            highestEmissions.transportation.percentage = Number(((highestEmissions.transportation.value / total) * 100).toFixed(2));
            highestEmissions.electricity.percentage = Number(((highestEmissions.electricity.value / total) * 100).toFixed(2));
        }
        
        foodCategory = percentageEmissions.find(e => e.category === "Food 🥗");
        transportationCategory = percentageEmissions.find(e => e.category === "Transportation 🛻");
        electricityCategory = percentageEmissions.find(e => e.category === "Electricity ⚡");
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <StyledLayout className='flex-1 p-4 py-10'>
                <StyledLayout className='items-center'>
                    <Text className='' style={{ fontFamily: 'Poppins-Medium', fontSize: 25 }}>Your initial footprint</Text>
                    <StyledLayout
                        className=""
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            top: 0,
                            left: 0,
                            right: 0,
                        }}
                    >
                        <Text
                            className=""
                            style={{
                                fontFamily: 'Poppins-Bold',
                                fontSize: 100,
                                textAlign: 'center',
                                top: 20,
                                color: myTheme['color-success-700']

                            }}
                        >
                            {initialFootprint.toFixed(2)}
                        </Text>
                        <Text
                            className=""
                            style={{
                                fontFamily: 'Poppins-SemiBold',
                                fontSize: 30,
                                textAlign: 'center',
                                bottom: 20,
                            }}
                        >
                            tons
                        </Text>
                        <Text
                            className=""
                            style={{
                                fontFamily: 'Poppins-Regular',
                                fontSize: 15,
                                textAlign: 'center',
                                bottom: 30
                            }}
                        >
                            of CO₂e per year
                        </Text>
                    </StyledLayout>
                </StyledLayout>
                
                <StyledLayout className='justify-center mt-5'>
                    {sortedEmissions.map((emission, index) => {
                        const widthPercentage = maxWidth - index * widthDecrement;
                        const backgroundColor = `rgba(0, 100, 0, ${1 - index * 0.3})`;
                        const textColor = `rgba(255, 255, 255, ${0.7 + index * 0.3})`;

                        return (
                            <StyledLayout
                                key={index}
                                className="w-full rounded-xl p-3 mb-2 bottom-3"
                                style={{
                                    width: `${widthPercentage}%`,
                                    backgroundColor,
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexDirection: 'row'
                                }}
                            >
                                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 18, color: textColor }}>
                                    {emission.category}
                                </Text>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 18, color: textColor }}>
                                    {emission.value.toFixed(2)} tons
                                </Text>
                            </StyledLayout>
                        );
                    })}
                </StyledLayout>

                {/* Emission Contributors Section */}
                <StyledLayout className='py-10 p-2'>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 25 }}>Main Emissions</Text>
                    </View>

                    <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 22, color: myTheme['color-success-900'] }}>
                        Food
                    </Text>
                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 20, color: myTheme['color-success-700']}}>
                        {foodCategory ? foodCategory.percentage : 0}%<Text style={{fontFamily: 'Poppins-Regular' }}> of your footprint</Text>
                    </Text>
                    
                    <View style={{ alignItems: 'center' }}>
                        <StyledCard className='border p-2 w-full items-center rounded-xl shadow mb-2' 
                            style={{
                                borderColor: myTheme['color-success-900'], 
                                backgroundColor: myTheme['color-success-transparent-100']
                                }}
                            >
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 25, color: myTheme['color-success-700']}}>
                                    {highestEmissions.food.value.toFixed(2)}<Text style={{fontFamily: 'Poppins-Regular' }}> kg</Text>
                                </Text>
                                <Text style={{fontFamily: 'Poppins-SemiBold' }}>
                                    <Text style={{fontFamily: 'Poppins-Regular' }}>from</Text> {highestEmissions.food.source || 'Unknown'} 
                                </Text>
                            </View>
                        </StyledCard>
                    </View>


                    <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 22, color: myTheme['color-success-900'] }}>
                        Transportation
                    </Text>
                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 20, color: myTheme['color-success-700']}}>
                        {transportationCategory ? transportationCategory.percentage : 0}%<Text style={{fontFamily: 'Poppins-Regular' }}> of your footprint</Text>
                    </Text>

                    <View style={{ alignItems: 'center' }}>
                        <StyledCard className='border p-2 w-full items-center rounded-xl shadow mb-2' 
                            style={{
                                borderColor: myTheme['color-success-900'], 
                                backgroundColor: myTheme['color-success-transparent-100']
                                }}
                            >
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 25, color: myTheme['color-success-700']}}>
                                {highestEmissions.transportation.value.toFixed(2)}<Text style={{fontFamily: 'Poppins-Regular' }}> kg</Text>
                                </Text>
                                <Text style={{fontFamily: 'Poppins-SemiBold' }}>
                                    <Text style={{fontFamily: 'Poppins-Regular' }}>from</Text> {highestEmissions.transportation.source || 'Unknown'} 
                                </Text>
                            </View>
                        </StyledCard>
                    </View>

                    <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 22, color: myTheme['color-success-900'] }}>
                        Electricity
                    </Text>
                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 20, color: myTheme['color-success-700']}}>
                        {electricityCategory ? electricityCategory.percentage : 0}%<Text style={{fontFamily: 'Poppins-Regular' }}> of your footprint</Text>
                    </Text>

                    <View style={{ alignItems: 'center' }}>
                        <StyledCard className='border p-2 w-full items-center rounded-xl shadow mb-2' 
                            style={{
                                borderColor: myTheme['color-success-900'], 
                                backgroundColor: myTheme['color-success-transparent-100']
                                }}
                            >
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 25, color: myTheme['color-success-700']}}>
                                {highestEmissions.electricity.value.toFixed(2)}<Text style={{fontFamily: 'Poppins-Regular' }}> kg</Text>
                                </Text>
                                <Text style={{fontFamily: 'Poppins-SemiBold' }}>
                                    <Text style={{fontFamily: 'Poppins-Regular' }}>from</Text> {highestEmissions.electricity.source || 'Unknown'} 
                                </Text>
                            </View>
                        </StyledCard>
                    </View>               
                </StyledLayout>
                
                <StyledLayout style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: 5,
                    paddingHorizontal: 30,
                    alignItems: 'flex-end'
                }}>
                    <TouchableOpacity
                        onPress={() => router.push('/(tabs)/Home')}
                    >
                    <Text style={{fontFamily:'Poppins-SemiBold', fontSize: 23, alignItems: 'center', color: myTheme['color-success-900']}}>Take action 
                        <Text style={{color: myTheme['color-success-700'], fontSize: 28}}> →</Text>
                    </Text>
                    </TouchableOpacity>
                </StyledLayout>
            </StyledLayout>
        </ScrollView>
    );
};

export default QuizEnd;