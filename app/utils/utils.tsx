import auth from '@react-native-firebase/auth';
import db from '@react-native-firebase/database';
import { router } from 'expo-router';
import { Platform, BackHandler } from 'react-native';
import firestore, { firebase } from '@react-native-firebase/firestore';

export async function goToInterface(role: string) {
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

export function handleLogOut() {
    firebase.auth().signOut();
    router.push('..');
}

export function handleBackAction(){
    if (Platform.OS === "android") {
        BackHandler.exitApp();
        return true; // Indicate that the back button press is handled
    }
    return false; // Default behavior for other platforms
}