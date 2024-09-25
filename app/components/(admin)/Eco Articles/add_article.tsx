import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { ArticleInfo } from "@/types/ArticleInfo";
import { Card, IconButton, Button, TextInput } from "react-native-paper";
import { FlatList, TouchableWithoutFeedback } from "react-native-gesture-handler";
import firestore from '@react-native-firebase/firestore';
import moment from "moment";
import { router } from "expo-router";

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
  
  const [visibleInput, setVisibleInput] = useState<string | null>(null);

  const clearAllInput = () => {
    setTitle(undefined);
    setCategory(undefined);
    setImpact(undefined);
    setFacts([]);
    setBenefits([]);
    setInstructions([]);
  }

  const handleAddFact = () => {
    if (newFact.content.trim()) {
      setFacts([...facts, newFact]);
      setNewFact({ id: "", content: "" });
      setVisibleInput(null);
    }
  };

  const handleAddBenefit = () => {
    if (newBenefit!.content.trim()) {
      setBenefits([...benefits, newBenefit]);
      setNewBenefit({ id: "", content: "" });
      setVisibleInput(null);
    }
  };

  const handleAddInstruction = () => {
    if (newInstruction.content.trim()) {
      setInstructions([...instructions, newInstruction]);
      setNewInstruction({ id: "", content: "" });
      setVisibleInput(null);
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

  const handleAddEcoAction = () => {
    const timestamp = Date.now().toString();
    const ecoActionsCollection = firestore().collection('eco_actions');

    return ecoActionsCollection.add({
      category: category,
      impact: impact,
      title: title,
      updated_at: timestamp
    })
  } 

  const handleAddArticleInfo = async (actionId : string) => {
    const factsCollection = firestore().collection('eco_facts');
    const benefitsCollection = firestore().collection('eco_benefits');
    const instructionsCollection = firestore().collection('eco_instructions');

    if (facts.length > 0){
      await Promise.all(facts.map(async (fact) => {
        await factsCollection.add({
          content: fact.content,
          action: actionId
        });
      }))  
    }

    if (benefits.length > 0){
      await Promise.all(benefits.map(async (benefit) => {
        await benefitsCollection.add({
          content: benefit.content,
          action: actionId
        });
      }))  
    }

    if (instructions.length > 0){
      await Promise.all(instructions.map(async (instruction) => {
        await instructionsCollection.add({
          content: instruction.content,
          action: actionId
        });
      }))  
    }
  }

  const handleSubmit = async () => {
    if (title && category && impact){
      const newEcoAction = await handleAddEcoAction();

      handleAddArticleInfo(newEcoAction.id);
    }

    router.push('/(admin)/Eco Articles/list');
    clearAllInput();
  }

  const renderItem = (item: ArticleInfo, type: string) => (
    <Card style={{ margin: 10 }} onLongPress={() => handleDelete(item, type)}>
      <Card.Content>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.content}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={{ padding: 20 }}>
      <View className="flex-row justify-between items-end mb-3">
        <Text className="text-2xl">Adding {"\n"}a new article</Text>
        <Button className="h-10" mode="contained" onPress={handleSubmit}>Submit</Button>
      </View>
      <ScrollView>
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
          const isInstruction = sectionTitle === "Instructions";

          return (
            <View key={index}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 24, fontWeight: "bold" }}>{sectionTitle}</Text>
                <IconButton
                  icon="plus"
                  onPress={() => {
                    setVisibleInput(isFact ? 'fact' : isBenefit ? 'benefit' : 'instruction');
                  }}
                />
              </View>

              {visibleInput === (isFact ? 'fact' : isBenefit ? 'benefit' : 'instruction') && (
                <TouchableWithoutFeedback onPress={() => setVisibleInput(null)}>
                  <Card style={{ margin: 10 }}>
                    <TextInput className="max-h-32 hwrap"
                      placeholder="Content"
                      value={isFact ? newFact.content : isBenefit ? newBenefit.content : newInstruction.content}
                      onChangeText={(text) => {
                        if (isFact) {
                          setNewFact({ content: text } as ArticleInfo);
                        } else if (isBenefit) {
                          setNewBenefit({ content: text } as ArticleInfo) ;
                        } else {
                          setNewInstruction({ content: text } as ArticleInfo);
                        }
                      }}
                    multiline />
                    <Card.Actions>
                      <Button
                        onPress={isFact ? handleAddFact : isBenefit ? handleAddBenefit : handleAddInstruction}
                      >
                        Done
                      </Button>
                    </Card.Actions>
                  </Card>
                </TouchableWithoutFeedback>
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
    </View>
  );
};

export default AddArticle;
