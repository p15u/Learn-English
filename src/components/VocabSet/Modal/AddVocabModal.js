import React, { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableHighlight,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import Text from "../../Text";
import Modal from "react-native-modalbox";
import { AntDesign } from "@expo/vector-icons";
import AddVocabItems from "../AddVocabItems";
import vocabApi from "../../../api/vocabApi";
import { FirebaseContext } from "../../../context/FirebaseContext";

import LoadingModal from "../../LoadingModal";

const AddVocabModal = ({ forwardRef, vocabSet, setIsUpdateVocabSet }) => {
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight = Dimensions.get("window").height;

  const [vocabItem, setvocabItem] = useState([]);
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
    vocabItem.map((item) => {
      (item.term == "" || item.define == "") && (valid = false);
      if (item.term == "" || item.define == "") {
        Alert.alert(
          "Term and Define of vocabulary cannot be empty!",
          "Please make sure you have filled all the compusory input",
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

  const handleAddVocab = async () => {
    const validForm = checkValidate();

    if (validForm == true) {
      setLoadingModal(true);
      const newVocabItemsPromise = vocabItem.map(async (item) => {
        const url = await firebase.uploadVocabPhoto(
          item.image,
          vocabSet.id,
          item.idVocab
        );
        item.image = url;
        return item;
      });

      const newVocabItems = await Promise.all(newVocabItemsPromise);
      const newVocabs = {
        vocabs: vocabSet.vocabs.concat(newVocabItems),
      };

      await vocabApi.put(newVocabs, vocabSet.id);

      setIsUpdateVocabSet(Math.random());
      setvocabItem([]);
      forwardRef.current.close();

      setLoadingModal(false);
    }
  };

  const handleCreateVocab = () => {
    setvocabItem((prevVocabItem) => [
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

  const onClickCancel = () => {
    setvocabItem([]);
    forwardRef.current.close();
  };

  const deleteVocab = (index) => {
    const itemsCopy = vocabItem.filter((item) => item.idVocab !== index);
    setvocabItem(itemsCopy);
  };

  const updateVocab = (vocabitem) => {
    const newVocabItems = vocabItem.map((item) =>
      item.idVocab === vocabitem.idVocab ? vocabitem : item
    );
    setvocabItem(newVocabItems);
  };

  const renderItem = ({ item }) => {
    return (
      <AddVocabItems
        key={item.idVocab}
        idVocabItem={item.idVocab}
        deleteVocab={() => deleteVocab(item.idVocab)}
        updateVocab={updateVocab}
      />
    );
  };

  return (
    <Modal
      style={{
        borderRadius: 10,
        shadowRadius: 10,
        width: deviceWidth - 50,
        height: 620,
      }}
      backdrop={true}
      ref={forwardRef}
      backdropOpacity={0.8}
      swipeToClose={false}
    >
      {loadingModal && <LoadingModal />}
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text heavy large style={{ alignSelf: "center" }}>
            Add Vocabulary
          </Text>
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 0,
              alignSelf: "flex-end",
            }}
            onPress={handleCreateVocab}
          >
            <AntDesign name="pluscircleo" color="#4a90e2" size={30} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={vocabItem}
          renderItem={renderItem}
          keyExtractor={(item) => item.idVocab}
          ListEmptyComponent={
            <View
              style={{
                height: 500,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AntDesign name="exclamationcircle" color="#4a90e2" size={40} />
              <Text heavy medium style={{ marginTop: 20 }}>
                Press <AntDesign name="pluscircleo" color="#4a90e2" size={16} />{" "}
                icon to create new vocabylary
              </Text>
            </View>
          }
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: 10,
          }}
        >
          <TouchableHighlight
            disabled={vocabItem.length === 0}
            style={{
              backgroundColor: vocabItem.length === 0 ? "gray" : "#68aaf7",
              padding: 10,
              width: "45%",
              alignItems: "center",
              borderRadius: 10,
            }}
            underlayColor="#388FF4"
            onPress={handleAddVocab}
          >
            <Text heavy style={{ color: "#FFFFFF" }}>
              Save
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={{
              backgroundColor: "#8B8B8B",
              padding: 10,
              width: "45%",
              alignItems: "center",
              borderRadius: 10,
            }}
            underlayColor="#727272"
            onPress={onClickCancel}
          >
            <Text heavy style={{ color: "#FFFFFF" }}>
              Cancel
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    </Modal>
  );
};

export default AddVocabModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    height: "100%",
  },
});
