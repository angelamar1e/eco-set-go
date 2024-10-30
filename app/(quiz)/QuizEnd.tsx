import { EmissionsContext } from '@/contexts/Emissions';
import { EmissionsDataContext } from '@/contexts/EmissionsData';
import { useUserContext } from '@/contexts/UserContext';
import firestore from '@react-native-firebase/firestore';
import { Text } from '@ui-kitten/components';
import { useContext } from 'react';

const QuizEnd = () => {

    const {userUid} = useUserContext();
    const {foodEmissions, transportationEmissions, electricityEmissions, totalEmissions} = useContext(EmissionsDataContext);

    const setInitialFootprint = () => {
        firestore().collection("initial_footprint").doc(userUid).set(
            {
                food_footprint: foodEmissions,
                transportation_footprint: transportationEmissions,
                electricity_footprint: electricityEmissions,
                overall_footprint: totalEmissions
            }
        )
    }

    setInitialFootprint();

    return (
        <Text>
            Congrats!
        </Text>
    )
}

export default QuizEnd