import auth from '@react-native-firebase/auth';
import db from '@react-native-firebase/database';
import { router } from 'expo-router';
import { Platform, BackHandler } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../components/AuthContext';

const { userUid } = useAuth();

export async function getRole() {
    const doc = await firestore().collection('users').doc(userUid).get()
    const role = doc.data().role

    if (role) {
        return role;
    } else {
        return ''; // case where the role doesn't exist
    }
}

export async function getUserName(uid: string){
    const userData = (await firestore().collection('users').doc(uid).get()).data();
    const userName = userData!.username;

    return userName;
}

export async function goToInterface() {
    const role = await getRole();
    console.log(role);

    if (role == 'user'){
        router.push('/(tabs)/Home');
    }
    else if (role == 'admin'){
        router.push('/(admin)');
    }
    else{
        return;
    }
}

export async function handleLogOut() {
    auth().signOut;
    router.push('..');
}

export function handleBackAction(){
    if (Platform.OS === "android") {
        BackHandler.exitApp();
        return true; // Indicate that the back button press is handled
    }
    return false; // Default behavior for other platforms
}