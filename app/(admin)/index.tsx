import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { EcoAction } from '../../types/EcoAction';

const MyComponent = () => {
  const [ecoActions, setEcoActions] = useState<EcoAction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const articles = await getArticles();
      setEcoActions(articles);
    };

    fetchData();
  }, []);

  async function getArticles(): Promise<EcoAction[]> {
    const ecoArticleDocs = await firestore().collection('eco_actions').get();
    return ecoArticleDocs.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
    })) as EcoAction[];
  }

  const handleDelete = async (id: string) => {
    await firestore().collection('eco_actions').doc(id).delete();
    setEcoActions(prevActions => prevActions.filter(action => action.id !== id));
  };

  const handleEdit = async (id: string, newTitle: string) => {
    await firestore().collection('eco_actions').doc(id).update({ title: newTitle });
    setEcoActions(prevActions => 
      prevActions.map(action => action.id === id ? { ...action, title: newTitle } : action)
    );
  };

  const renderRightActions = (id: string) => (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity onPress={() => handleEdit(id, "Updated Title")} style={{ backgroundColor: 'blue', justifyContent: 'center', padding: 20 }}>
        <Text style={{ color: 'white' }}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelete(id)} style={{ backgroundColor: 'red', justifyContent: 'center', padding: 20 }}>
        <Text style={{ color: 'white' }}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 24 }}>Eco Actions</Text>
        <Button title="Add Eco Action"/>
      </View>

      <FlatList
        data={ecoActions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => renderRightActions(item.id)}
            friction={2} // Adjust swipe sensitivity
            overshootRight={false} // Disable overshoot effect
          >
            <View style={{ padding: 20, borderBottomWidth: 1, borderColor: '#ccc' }}>
              <Text>{item.title}</Text>
            </View>
          </Swipeable>
        )}
      />
    </View>
  );
};

export default MyComponent;