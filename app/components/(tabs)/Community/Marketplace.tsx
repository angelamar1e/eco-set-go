import React, { useState, useEffect } from 'react';
import { View, FlatList, ScrollView, Text } from 'react-native';
import ListingCard from './MarketplacePostCard';
import CreateListing from './MarketplaceCreatePost';
import firestore, { Timestamp } from '@react-native-firebase/firestore';
import { handleEditListing, handleDeleteListing } from '@/app/utils/marketplaceUtils'; // Import marketplace utility functions

interface Listing {
  id: string;
  content: string;
  userName: string;
  price: string;
  timestamp: Timestamp;
}

const MarketplacePosts: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const unsubscribeListings = firestore()
      .collection('listings')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const fetchedListings = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Listing[];
        setListings(fetchedListings);
      });

    return () => {
      unsubscribeListings();
    };
  }, []);

  return (
    <FlatList
      data={listings}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ListingCard
          id={item.id} // Pass the ID
          content={item.content}
          userName={item.userName}
          price={item.price}
          timestamp={item.timestamp}
          onEdit={(newContent) => handleEditListing(item.id, newContent)} // Pass the edit handler
          onDelete={() => handleDeleteListing(item.id)} // Pass the delete handler
        />
      )}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={<CreateListing />} // Include the CreateListing component
    />
  );
};

export default MarketplacePosts;
