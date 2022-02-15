import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  Image,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { AntDesign } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

const AddVocabItems = (props) => {
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

  const [profilePhoto, setProfilePhoto] = useState("");
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

  const passDataToVocabSet = () => {
    const vocabItem = {
      idVocab: props.idVocabItem,
      wordType,
      spelling,
      term,
      define,
      image: profilePhoto,
      createAt: getCurrentDate(),
    };

    props.updateVocab(vocabItem);
  };

  return (
    <View style={styles.vocabItemContainer}>
      <View style={styles.vocabItemHeader}>
        <Text
          heavy
          medium
          style={{
            alignSelf: "center",
            color: "#FFFFFF",
          }}
        >
          Vocabulary
        </Text>
        <TouchableOpacity onPress={props.deleteVocab}>
          <AntDesign name="delete" color="#e29c4a" size={20} />
        </TouchableOpacity>
      </View>
      <View style={styles.vocabContentContainer}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            containerStyle={{ width: "45%" }}
            dropDownContainerStyle={{ height: 100 }}
            textStyle={{
              fontSize: 13,
            }}
            listMode="SCROLLVIEW"
            onChangeValue={(value) => setWordType(value)}
            onBlur={passDataToVocabSet}
          />

          <TouchableHighlight
            style={styles.imgChooser}
            underlayColor="#c5c7cf"
            onPress={addProfilePhoto}
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

        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="Term, ex: Animal"
              onChangeText={(text) => setTerm(text)}
              onBlur={passDataToVocabSet}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="Spelling, ex: ˈanəməl"
              onChangeText={(text) => setSpelling(text)}
              onBlur={passDataToVocabSet}
            />
          </View>
        </View>
        <View style={{ padding: 5 }}>
          <TextInput
            style={styles.inputField}
            placeholder="Word's define"
            onChangeText={(text) => setDefine(text)}
            onBlur={passDataToVocabSet}
          />
        </View>
      </View>
    </View>
  );
};

export default AddVocabItems;

const styles = StyleSheet.create({
  vocabItemContainer: {
    backgroundColor: "#4a90e2",
    marginTop: 20,
    borderRadius: 10,
  },

  vocabItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    padding: 10,
    marginBottom: 10,
  },

  vocabContentContainer: {
    padding: 10,
  },

  inputField: {
    borderBottomColor: "#FFFFFF",
    borderBottomWidth: 1,
    paddingTop: 2,
    paddingBottom: 2,
    color: "#FFFFFF",
  },

  inputContainer: {
    padding: 5,
    width: "50%",
  },

  imgChooser: {
    backgroundColor: "#e1e2e6",
    width: 70,
    height: 70,
    borderRadius: 15,
    overflow: "hidden",
    marginRight: 30,
    borderColor: "black",
    borderWidth: 1,
  },
});
