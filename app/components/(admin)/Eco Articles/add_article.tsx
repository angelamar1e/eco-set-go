import React, { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, FlatList, Image, TouchableOpacity } from "react-native";
import { ArticleInfo } from "@/types/ArticleInfo";
import { Card, IconButton, Button, TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
// import * as VideoThumbnails from 'expo-video-thumbnails'; // For video thumbnails
import firestore from '@react-native-firebase/firestore';
import { router } from "expo-router";
import { Video } from 'expo-av'; // Import Video from expo-av

const AddArticle = () => {
  const [title, setTitle] = useState<string>();
  const [category, setCategory] = useState<string>();
  const [impact, setImpact] = useState<string>();
  const [facts, setFacts] = useState<ArticleInfo[]>([]);
  const [benefits, setBenefits] = useState<ArticleInfo[]>([]);
  const [instructions, setInstructions] = useState<ArticleInfo[]>([]);
  const [newFact, setNewFact] = useState<ArticleInfo>({ id: "", content: "" });
  const [newBenefit, setNewBenefit] = useState<ArticleInfo>({ id: "", content: "" });
  const [newInstruction, setNewInstruction] = useState<ArticleInfo>({ id: "", content: "" });

  const [visibleInput, setVisibleInput] = useState<string>();
  const [selectedMedia, setSelectedMedia] = useState<{uri: string; type: string | undefined}>(); // New state for media
  const scrollRef = useRef<ScrollView>(null);

  const clearAllInput = () => {
    setTitle(undefined);
    setCategory(undefined);
    setImpact(undefined);
    setFacts([]);
    setBenefits([]);
    setInstructions([]);
    setSelectedMedia(undefined); // Clear selected media
  };

  const handleAddFact = () => {
    if (newFact.content.trim()) {
      setFacts([...facts, { ...newFact, media: selectedMedia }]); // Add media to the fact
      setNewFact({ id: "", content: "" });
      setVisibleInput(undefined);
      setSelectedMedia(undefined); // Reset media selection
    }
  };

  const handleAddBenefit = () => {
    if (newBenefit.content.trim()) {
      setBenefits([...benefits, { ...newBenefit, media: selectedMedia }]); // Add media to the benefit
      setNewBenefit({ id: "", content: "" });
      setVisibleInput(undefined);
      setSelectedMedia(undefined); // Reset media selection
    }
  };

  const handleAddInstruction = () => {
    if (newInstruction.content.trim()) {
      setInstructions([...instructions, { ...newInstruction, media: selectedMedia }]); // Add media to the instruction
      setNewInstruction({ id: "", content: "" });
      setVisibleInput(undefined);
      setSelectedMedia(undefined); // Reset media selection
    }
  };

  const handleDelete = (item: ArticleInfo, type: string) => {
    switch (type) {
      case "facts":
        setFacts(facts.filter((fact) => fact !== item));
        break;
      case "benefits":
        setBenefits(benefits.filter((benefit) => benefit !== item));
        break;
      case "instructions":
        setInstructions(instructions.filter((inst) => inst !== item));
        break;
    }
  };

  const handleMediaSelect = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All, // Allow images and videos
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        const selectedAsset = result.assets[0];
        setSelectedMedia({uri: selectedAsset.uri, type: selectedAsset.type});
      }
    } else {
      alert("Permission to access media library is required!");
    }
  };

  const handleSubmit = async () => {
    if (title && category && impact) {
      const ecoActionsCollection = firestore().collection('eco_actions');
      const newEcoAction = await ecoActionsCollection.add({
        category: category,
        impact: impact,
        title: title,
        updated_at: new Date().toISOString(),
      });

      if (newEcoAction.id) {
        const factsCollection = firestore().collection('eco_facts');
        const benefitsCollection = firestore().collection('eco_benefits');
        const instructionsCollection = firestore().collection('eco_instructions');

        const promises = [
          ...facts.map(fact => factsCollection.add({ content: fact.content, media: fact.media, action: newEcoAction.id })),
          ...benefits.map(benefit => benefitsCollection.add({ content: benefit.content, media: benefit.media, action: newEcoAction.id })),
          ...instructions.map(instruction => instructionsCollection.add({ content: instruction.content, media: instruction.media, action: newEcoAction.id })),
        ];

        await Promise.all(promises);
      }

      clearAllInput();
      router.push('/(admin)/Eco Articles/list');
    }
  };

  const renderItem = (item: ArticleInfo, type: string) => (
    <Card style={{ margin: 10 }} onLongPress={() => handleDelete(item, type)}>
      <Card.Content>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.content}</Text>
        <Card.Cover source={{uri: item.media?.uri}}></Card.Cover>
        {item.media && (
          <TouchableOpacity>
            {item.media.type && item.media.type.startsWith('image/') ? (
              <Image source={{ uri: item.media.uri }} style={{ width: 100, height: 100 }} /> // Display image
            ) : item.media.type && item.media.type.startsWith('video/') ? (
              <Video
                source={{ uri: item.media.uri }} // Display video
                style={{ width: 100, height: 100 }}
                // resizeMode=""
                shouldPlay={false}
                isLooping
                useNativeControls
              />
            ) : null}
          </TouchableOpacity>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <KeyboardAvoidingView
      behavior={'padding'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={80}
    >
      <ScrollView 
        ref={scrollRef} 
        contentContainerStyle={{ padding: 20 }} 
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
          <Text style={{ fontSize: 24 }}>Adding a New Article</Text>
          <Button mode="contained" onPress={handleSubmit}>Submit</Button>
        </View>
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          style={{ marginBottom: 10, borderWidth: 1, borderColor: "#ccc" }}
        />
        <TextInput
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
          style={{ marginBottom: 10, borderWidth: 1, borderColor: "#ccc" }}
        />
        <TextInput
          placeholder="Impact (in grams of CO2eq)"
          value={impact}
          onChangeText={setImpact}
          keyboardType="numeric"
          style={{ marginBottom: 10, borderWidth: 1, borderColor: "#ccc" }}
        />

        {["Facts", "Benefits", "Instructions"].map((sectionTitle, index) => {
          const isFact = sectionTitle === "Facts";
          const isBenefit = sectionTitle === "Benefits";

          return (
            <View key={index}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 24, fontWeight: "bold" }}>{sectionTitle}</Text>
                <IconButton
                  icon="plus"
                  onPress={() => setVisibleInput(isFact ? 'fact' : isBenefit ? 'benefit' : 'instruction')}
                />
              </View>

              {visibleInput === (isFact ? 'fact' : isBenefit ? 'benefit' : 'instruction') && (
                <Card style={{ margin: 10 }}>
                  <TextInput
                    placeholder="Content"
                    value={isFact ? newFact.content : isBenefit ? newBenefit.content : newInstruction.content}
                    onChangeText={(text) => {
                      if (isFact) setNewFact({ content: text } as ArticleInfo);
                      else if (isBenefit) setNewBenefit({ content: text } as ArticleInfo);
                      else setNewInstruction({ content: text } as ArticleInfo);
                    }}
                    multiline
                    style={{ minHeight: 60 }} // Adjust the height for better UX
                  />
                  <Button onPress={handleMediaSelect}>Select Media</Button>
                  {selectedMedia && (
                    <>
                    <Card.Cover source={{uri: selectedMedia.uri}}></Card.Cover>
                    <View style={{ marginVertical: 10 }}>
                      {selectedMedia.type && selectedMedia.type.startsWith('image') ? (
                        <Image source={{ uri: selectedMedia.uri }} style={{ width: 100, height: 100 }} /> // Display selected image
                      ) : selectedMedia.type && selectedMedia.type.startsWith('video') ? (
                        <Video
                          source={{ uri: selectedMedia.uri }} // Display selected video
                          style={{ width: 100, height: 100 }}
                          // resizeMode="cover"
                          shouldPlay={false}
                          isLooping
                          useNativeControls
                        />
                      ) : null}
                    </View>
                    </>
                  )}
                  <Card.Actions>
                    <Button onPress={isFact ? handleAddFact : isBenefit ? handleAddBenefit : handleAddInstruction}>
                      Done
                    </Button>
                  </Card.Actions>
                </Card>
              )}

              <FlatList
                data={isFact ? facts : isBenefit ? benefits : instructions}
                renderItem={({ item }) => renderItem(item, sectionTitle.toLowerCase())}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          );
        })}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddArticle;
