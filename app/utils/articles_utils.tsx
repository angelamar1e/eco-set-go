import { EcoAction } from '@/types/EcoAction';
import firestore from '@react-native-firebase/firestore';

export async function getEcoActionsList(): Promise<EcoAction[]> {

  const ecoActionsCollection = await firestore().collection('eco_actions').get();

  return ecoActionsCollection.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
      })) as EcoAction[];
}