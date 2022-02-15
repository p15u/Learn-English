import React, { useState, useContext } from "react";
import styled from "styled-components";

import VocabItem from "../../components/VocabSet/VocabItem";

import { FirebaseContext } from "../../context/FirebaseContext";

import vocabApi from "../../api/vocabApi";
import Header from "../../components/Header";
import Button from "../../components/VocabSet/Button";
import VocabSetInput from "../../components/VocabSet/VocabSetInput";
import { Alert } from "react-native";
import LoadingModal from "../../components/LoadingModal";

const CreateVocabScreen = ({ navigation }) => {
  const [vocabSetTitle, setVocabSetTitle] = useState("");
  const [vocabSetDescription, setVocabSetDescription] = useState("");
  const [vocabItems, setVocabItems] = useState([]);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isCreateVocab, setIsCreateVocab] = useState(true);
  const [isEmptyTitle, setIsEmptyTitle] = useState(false);
  const [isEmptyTerm, setIsEmptyTerm] = useState(false);
  const [isEmptyDefine, setIsEmptyDefine] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);

  const firebase = useContext(FirebaseContext);

  const getCurrentDate = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();

    return (today = mm + "/" + dd + "/" + yyyy);
  };

  const checkValidate = () => {
    let valid = true;
    if (vocabSetTitle == "") {
      setIsEmptyTitle(true);
      valid = false;
    } else {
      setIsEmptyTitle(false);
    }

    if (isEmptyTerm == true || isEmptyDefine == true) {
      valid = false;
    }

    vocabItems.map((item) => {
      (item.term == "" || item.define == "") && (valid = false);
      if (item.term == "" || item.define == "") {
        Alert.alert(
          "Term and Define of vocabulary cannot be empty!",
          "Please make sure you have filled all the compusory input?",
          [
            {
              text: "OK",
              style: "cancel",
            },
          ]
        );
      }
    });
    return valid;
  };

  const handleCreateVocabSet = async () => {
    const validCreateForm = checkValidate();
    if (validCreateForm == true) {
      setLoadingModal(true);
      const uid = await firebase.getCurrentUser().uid;
      const vocabSet = {
        uid: uid,
        title: vocabSetTitle,
        description: vocabSetDescription,
        isFavourite: isFavourite,
        vocabs: vocabItems,
        createAtInMills: Date.now(),
        createAt: getCurrentDate(),
        public: 0,
      };
      const response = await vocabApi.post(vocabSet);
      await handleUploadImageVocab(response.id);
      navigation.navigate("ManageVocabSetScreen");
      setLoadingModal(false);
    }
  };

  const handleUploadImageVocab = async (vocabSetId) => {
    const newVocabItemsPromise = vocabItems.map(async (item) => {
      const url = await firebase.uploadVocabPhoto(
        item.image,
        vocabSetId,
        item.idVocab
      );
      item.image = url;
      return item;
    });

    const newVocabItems = await Promise.all(newVocabItemsPromise);

    await vocabApi.put({ vocabs: newVocabItems }, vocabSetId);

    // Reset Vocab set State
    // setVocabSetTitle("");
    // setVocabSetDescription("");
    // setVocabItems([]);
  };

  const handleCreateVocab = () => {
    setVocabItems((prevVocabItem) => [
      ...prevVocabItem,
      {
        idVocab: Math.random().toString(36).substr(2, 9),
        wordType: "",
        term: "",
        spelling: "",
        define: "",
        image: "",
        createAt: getCurrentDate(),
      },
    ]);
  };

  const deleteVocab = (index) => {
    const itemsCopy = vocabItems.filter((item) => item.idVocab !== index);
    setVocabItems(itemsCopy);
  };

  const updateVocab = (vocabItem) => {
    const newVocabItems = vocabItems.map((item) =>
      item.idVocab === vocabItem.idVocab ? vocabItem : item
    );
    setVocabItems(newVocabItems);
  };

  const renderItem = ({ item }) => (
    <VocabItem
      key={item.idVocab}
      idVocabItem={item.idVocab}
      deleteVocab={() => deleteVocab(item.idVocab)}
      updateVocab={updateVocab}
    />
  );

  return (
    <Container>
      {loadingModal && <LoadingModal />}
      <Header
        navigation={navigation}
        handleCreateVocabSet={handleCreateVocabSet}
        isCreateVocab={isCreateVocab}
      />

      <SafeAreaView>
        <FlatList
          data={vocabItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.idVocab}
          ListHeaderComponent={
            <VocabSetInput
              setVocabSetTitle={setVocabSetTitle}
              setVocabSetDescription={setVocabSetDescription}
              vocabSetTitle={vocabSetTitle}
              vocabSetDescription={vocabSetDescription}
              isEmptyTitle={isEmptyTitle}
            />
          }
          removeClippedSubviews={true}
        />
      </SafeAreaView>

      <Button
        handleCreateVocab={handleCreateVocab}
        title="+ Add New Vocabulary"
      />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const SafeAreaView = styled.SafeAreaView`
  flex: 1;
`;

const FlatList = styled.FlatList`
  flex: 1;
`;

export default CreateVocabScreen;
