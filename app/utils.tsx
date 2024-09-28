import auth from '@react-native-firebase/auth';
import db from '@react-native-firebase/database';
import { router } from 'expo-router';
import { Platform, BackHandler } from 'react-native';
import firestore from '@react-native-firebase/firestore';


export async function checkSession() {
    const user = auth().currentUser!
    
    return user;
}

export async function getUserUid() {
    const user = await checkSession();
    const userUid = user.uid;
    
    return userUid;
}

export async function getRole() {
    const userUid = await getUserUid();

    const doc = await firestore().collection('users').doc(userUid).get()
    const role = doc.data()!.role

    if (role) {
        return role;
    } else {
        return ''; // Or handle the case where the role doesn't exist
    }
}

export async function goToInterface() {
    const role = await getRole();
    console.log(role);

    if (role == 'user'){
        router.push('/(tabs)');
    }
    else if (role == 'admin'){
        router.push('/(admin)');
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