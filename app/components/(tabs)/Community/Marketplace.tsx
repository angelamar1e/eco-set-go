import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
}

const initialProducts: Product[] = [
  { id: '1', name: 'Product 1', price: '$10', image: 'https://via.placeholder.com/150' },
  { id: '2', name: 'Product 2', price: '$20', image: 'https://via.placeholder.com/150' },
  { id: '3', name: 'Product 3', price: '$30', image: 'https://via.placeholder.com/150' },
];

const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity className="bg-white rounded-lg shadow p-4 mb-4">
      <Image source={{ uri: item.image }} className="w-full h-32 rounded" />
      <Text className="text-lg font-semibold mt-2">{item.name}</Text>
      <Text className="text-gray-600">{item.price}</Text>
      <TouchableOpacity className="mt-2 bg-lime-800 p-2 rounded-full">
        <Text className="text-white text-center">Add to Cart</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <Text className="text-2xl font-bold mb-4">Marketplace</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Marketplace;
