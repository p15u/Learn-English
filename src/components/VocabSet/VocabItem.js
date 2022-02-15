import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Image,
} from "react-native";

import styled from "styled-components";

import { AntDesign } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

const VocabItem = (props) => {
  const [profilePhoto, setProfilePhoto] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Nouns (n)", value: "Nouns (n)" },
    { label: "Verb (v)", value: "Verb (v)" },
    { label: "Adjective (adj)", value: "Adjective (adj)" },
    { label: "Adverb (adv)", value: "Adverb (adv)" },
    { label: "Prepositions (pre)", value: "Prepositions (pre)" },
    { label: "Orther", value: "Orther" },
  ]);
  const [wordType, setWordType] = useState("");
  const [term, setTerm] = useState("");
  const [spelling, setSpelling] = useState("");
  const [define, setDefine] = useState("");

  const getCurrentDate = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();

    return (today = mm + "/" + dd + "/" + yyyy);
  };

  const getPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } = await Camera.requestPermissionsAsync();

      return status === "granted";
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.cancelled) {
        setProfilePhoto(result.uri);
        passDataToVocabSet(result.uri, 5);
      }
    } catch (error) {
      console.log("ImagePicker: ", error);
    }
  };

  const addProfilePhoto = async () => {
    const status = await getPermissions();
    if (!status) {
      alert("We need permission to access your camera.");

      return;
    }
    pickImage();
  };

  const passDataToVocabSet = (value, type) => {
    const vocabItem = {
      idVocab: props.idVocabItem,
      wordType: type === 1 ? value : wordType,
      term: type === 2 ? value : term,
      spelling: type === 3 ? value : spelling,
      define: type === 4 ? value : define,
      image: type === 5 ? value : profilePhoto,
      createAt: getCurrentDate(),
    };

    props.updateVocab(vocabItem);
  };

  return (
    <VocabContainer>
      <HeaderVocab>
        <Text
          heavy
          large
          style={{
            alignSelf: "center",
            color: "#FFFFFF",
            padding: 10,
          }}
        >
          Vocabulary
        </Text>
        <DeleteIcon onPress={props.deleteVocab}>
          <AntDesign
            style={{ padding: 10 }}
            name="delete"
            color="#e29c4a"
            size={20}
          />
        </DeleteIcon>
      </HeaderVocab>
      <View style={styles.vocabContainer}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder="Word type"
          containerStyle={{ width: "45%", marginBottom: 10 }}
          textStyle={{
            fontSize: 14,
          }}
          onChangeValue={(value) => {
            setWordType(value);
            passDataToVocabSet(value, 1);
          }}
        />

        <View style={styles.Line2}>
          <View style={styles.InputContainer}>
            <Text style={styles.TextDecorate}>
              Term{" "}
              <Text medium bold style={{ color: "red" }}>
                *
              </Text>
            </Text>
            <TextInput
              style={styles.inputField}
              placeholder="Term, ex: Animal"
              onChangeText={(value) => {
                setTerm(value);
                passDataToVocabSet(value, 2);
              }}
              value={term}
            />
          </View>

          <View style={styles.InputContainer}>
            <Text style={styles.TextDecorate}>Spelling</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Spelling, ex: ˈanəməl"
              onChangeText={(value) => {
                setSpelling(value);
                passDataToVocabSet(value, 3);
              }}
              onBlur={passDataToVocabSet}
              value={spelling}
            />
          </View>
        </View>
        <View style={styles.Line3}>
          <View style={{ width: "70%" }}>
            <Text style={styles.TextDecorate}>
              Define{" "}
              <Text medium bold style={{ color: "red" }}>
                *
              </Text>
            </Text>
            <TextInput
              style={styles.inputField}
              placeholder="Word's define"
              onChangeText={(value) => {
                setDefine(value);
                passDataToVocabSet(value, 4);
              }}
              onBlur={passDataToVocabSet}
              value={define}
            />
          </View>

          <TouchableHighlight
            style={styles.imgChooser}
            underlayColor="#c5c7cf"
            onPress={addProfilePhoto}
            onBlur={passDataToVocabSet}
          >
            {profilePhoto ? (
              <Image style={{ flex: 1 }} source={{ uri: profilePhoto }} />
            ) : (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <AntDesign name="camera" size={24} color="#ffffff" />
              </View>
            )}
          </TouchableHighlight>
        </View>
      </View>
    </VocabContainer>
  );
};

const VocabContainer = styled.View`
  background-color: #4a90e2;
  justify-content: center;
  border-radius: 20px;
  box-shadow: -8px 10px 10px #888888;
  margin: 20px;
`;

const DeleteIcon = styled.TouchableOpacity``;

const HeaderVocab = styled.View`
  flex-direction: row;
  justify-content: space-between;
  border-bottom-color: black;
  border-bottom-width: 1px;
  padding: 10px;
`;

const styles = StyleSheet.create({
  vocabContainer: {
    padding: 20,
  },

  vocabContent: {},

  Line2: {
    flexDirection: "row",
  },

  DeleteIcon: {
    alignItems: "flex-end",
  },

  Line3: {
    width: "100%",
    marginTop: 20,
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  InputContainer: {
    padding: 5,
    width: "50%",
  },

  TextDecorate: {
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  inputField: {
    borderBottomColor: "#FFFFFF",
    borderBottomWidth: 1,
    paddingTop: 2,
    paddingBottom: 2,
    color: "#FFFFFF",
  },

  imgChooser: {
    backgroundColor: "#e1e2e6",
    width: 60,
    height: 60,
    borderRadius: 15,
    overflow: "hidden",
  },
});

export default VocabItem;
