import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Text from "../../Text";
import Modal from "react-native-modalbox";
import { AntDesign } from "@expo/vector-icons";
import vocabApi from "../../../api/vocabApi";
import { FirebaseContext } from "../../../context/FirebaseContext";
import DropDownPicker from "react-native-dropdown-picker";

import LoadingModal from "../../LoadingModal";

import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

const VocabDetailsModal = ({
  forwardRef,
  vocabList,
  vocabs,
  vocabSetID,
  isClickedEditModal,
  setIsUpdateVocabSet,
  isHome,
}) => {
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight = Dimensions.get("window").height;

  const [isClickedEdit, setIsClickedEdit] = useState(false);
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
  const [wordType, setWordType] = useState(vocabs.wordType);
  const [term, setTerm] = useState(vocabs.term);
  const [spelling, setSpelling] = useState(vocabs.spelling);
  const [define, setDefine] = useState(vocabs.define);
  const [profilePhoto, setProfilePhoto] = useState(vocabs.image);

  const [loadingModal, setLoadingModal] = useState(false);
  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    setWordType(vocabs.wordType);
    setTerm(vocabs.term);
    setSpelling(vocabs.spelling);
    setDefine(vocabs.define);
    setProfilePhoto(vocabs.image);
  }, [vocabs]);

  const onPressClose = () => {
    // setIsUpdateVocabSet(Math.random());
    forwardRef.current.close();
  };

  const onPressEdit = () => {
    setIsClickedEdit(!isClickedEdit);
  };

  const onPressSave = async () => {
    setLoadingModal(true);
    const url = await firebase.uploadVocabPhoto(
      profilePhoto,
      vocabSetID,
      vocabs.idVocab
    );

    const newVocabList = vocabList.filter((item) => {
      if (item.idVocab === vocabs.idVocab) {
        item.term = term;
        item.wordType = wordType;
        item.define = define;
        item.spelling = spelling;
        item.image = url;
      }

      return item;
    });

    await vocabApi.put({ vocabs: newVocabList }, vocabSetID);
    if (isClickedEditModal == true) {
      forwardRef.current.close();
    } else {
      setIsClickedEdit(false);
    }

    setLoadingModal(false);
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

  return (
    <Modal
      style={{
        borderRadius: 10,
        shadowRadius: 10,
        width: deviceWidth - 50,
        height: 600,
      }}
      backdrop={true}
      ref={forwardRef}
      backdropOpacity={0.8}
      swipeToClose={false}
    >
      <View style={styles.container}>
        <Text large heavy style={{ textAlign: "center" }}>
          Vocabulary Details
        </Text>
        {isHome === false && (
          <TouchableOpacity
            style={{ position: "absolute", top: 25, right: 20 }}
            onPress={isClickedEditModal ? onPressClose : onPressEdit}
          >
            {isClickedEdit === true ? (
              <Text style={{ color: "red" }}>Cancel</Text>
            ) : isClickedEditModal === true ? (
              <AntDesign name="closecircleo" color="red" size={20} />
            ) : (
              <Text style={{ color: "#388FF4" }}>
                <AntDesign name="edit" color="#388FF4" size={14} /> Edit
              </Text>
            )}
          </TouchableOpacity>
        )}

        {isClickedEdit === true || isClickedEditModal === true ? (
          <View style={{ justifyContent: "space-between", flex: 2 }}>
            <View style={{ marginTop: 10 }}>
              {loadingModal === true && <LoadingModal />}
              <View style={styles.inputFieldContainer}>
                <Text>Term: </Text>
                <TextInput
                  style={{
                    borderBottomColor: "black",
                    borderBottomWidth: 1,
                  }}
                  defaultValue={term}
                  onChangeText={(text) => setTerm(text)}
                />
                <Text style={{ marginLeft: 20 }}>Spelling: </Text>
                <TextInput
                  style={{
                    borderBottomColor: "black",
                    borderBottomWidth: 1,
                  }}
                  defaultValue={spelling}
                  onChangeText={(text) => setSpelling(text)}
                />
              </View>

              <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                placeholder={wordType}
                containerStyle={{ width: "45%", marginTop: 15 }}
                dropDownContainerStyle={{ height: 120 }}
                textStyle={{
                  fontSize: 13,
                }}
                onChangeValue={(value) => setWordType(value)}
              />
              <View style={styles.inputFieldContainer}>
                <AntDesign name="caretright" color="black" size={14} />
                <TextInput
                  style={{
                    borderBottomColor: "black",
                    borderBottomWidth: 1,
                    width: "100%",
                    paddingLeft: 5,
                  }}
                  multiline={true}
                  defaultValue={define}
                  onChangeText={(text) => setDefine(text)}
                />
              </View>
            </View>

            {profilePhoto !== "" ? (
              <View style={{ position: "relative" }}>
                <TouchableOpacity
                  style={{ position: "absolute", right: 5, top: 5, zIndex: 1 }}
                  onPress={addProfilePhoto}
                >
                  <AntDesign
                    name="camera"
                    color="white"
                    size={17}
                    style={{
                      textAlign: "right",
                      marginBottom: 5,
                    }}
                  />
                </TouchableOpacity>
                <Image
                  style={{
                    width: deviceWidth - 80,
                    height: 200,
                    borderRadius: 10,
                    alignSelf: "center",
                  }}
                  source={{ uri: profilePhoto }}
                />
              </View>
            ) : (
              <TouchableHighlight
                style={{
                  backgroundColor: "#68aaf7",
                  borderRadius: 100,
                  width: deviceWidth - 500,
                  alignSelf: "center",
                  padding: 10,
                }}
                onPress={addProfilePhoto}
                underlayColor="#388FF4"
              >
                <AntDesign
                  name="camera"
                  color="white"
                  size={20}
                  style={{
                    textAlign: "center",
                    margin: 10,
                  }}
                />
              </TouchableHighlight>
            )}

            <TouchableHighlight
              style={styles.saveBtn}
              onPress={onPressSave}
              underlayColor="#388FF4"
            >
              <Text heavy style={{ color: "#FFFFFF" }}>
                SAVE
              </Text>
            </TouchableHighlight>
          </View>
        ) : (
          <View style={{ justifyContent: "space-between", flex: 2 }}>
            <View style={{ marginTop: 20 }}>
              <Text large heavy>
                {vocabs.term}
                {"  "}[{vocabs.spelling}]
              </Text>
              <Text medium style={{ fontStyle: "italic" }}>
                {vocabs.wordType}
              </Text>
              <Text medium>
                <AntDesign name="caretright" color="black" size={14} />{" "}
                {vocabs.define}
              </Text>
            </View>

            <Image
              style={{
                width: deviceWidth - 80,
                height: 250,
                borderRadius: 10,
                alignSelf: "center",
              }}
              source={
                vocabs.image === ""
                  ? require("../../../../assets/image/no_img.png")
                  : {
                      uri: vocabs.image,
                    }
              }
            />

            <TouchableHighlight
              style={styles.closeBtn}
              onPress={onPressClose}
              underlayColor="#727272"
            >
              <Text heavy style={{ color: "#FFFFFF" }}>
                CLOSE
              </Text>
            </TouchableHighlight>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default VocabDetailsModal;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },

  closeBtn: {
    backgroundColor: "#8B8B8B",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  saveBtn: {
    backgroundColor: "#68aaf7",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  inputFieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    marginTop: 10,
  },
});
