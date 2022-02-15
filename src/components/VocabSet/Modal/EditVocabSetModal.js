import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modalbox";
import Text from "../../Text";
import vocabApi from "../../../api/vocabApi";
import { AntDesign } from "@expo/vector-icons";

const EditVocabSetModal = ({ forwardRef, vocabSet, setIsUpdateVocabSet }) => {
  const [EnteredTitle, setEnteredTitle] = useState(vocabSet.title);
  const [EnteredDescription, setEnteredDescription] = useState(
    vocabSet.description
  );
  const [isFocus, setIsFocus] = useState({
    isFocusTitle: false,
    isFocusDesc: false,
  });

  const [isClear, setIsClear] = useState({
    isClearTitle: false,
    isClearDesc: false,
  });

  const [isEmptyTitle, setIsEmptyTitle] = useState(false);

  const deviceWidth = Dimensions.get("window").width;

  const onBlurTextInput = () => {
    setIsFocus({
      isFocusTitle: false,
      isFocusDesc: false,
    });
  };

  const onClickCancel = () => {
    forwardRef.current.close();
    setIsClear({ isClearTitle: false, isClearDesc: false });
    setEnteredTitle(vocabSet.title);
    setEnteredDescription(vocabSet.description);
  };

  const onClickSave = async () => {
    if (EnteredTitle == "") {
      setIsEmptyTitle(true);
    } else {
      setIsEmptyTitle(false);
      const updateVocabs = {
        title: EnteredTitle,
        description: EnteredDescription,
      };
      await vocabApi.put(updateVocabs, vocabSet.id);
      setIsUpdateVocabSet(Math.random());
      forwardRef.current.close();
    }
  };

  const onChangeTitle = (text) => {
    setEnteredTitle(text);
    setIsClear({ isClearTitle: false, isClearDesc: isClear.isClearDesc });
  };

  const onChangeDecs = (text) => {
    setEnteredDescription(text);
    setIsClear({ isClearTitle: isClear.isClearTitle, isClearDesc: false });
  };

  const onPressClearTitle = () => {
    setIsClear({
      isClearTitle: true,
      isClearDesc: isClear.isClearDesc,
    });
    setEnteredTitle("");
  };

  const onPressClearDecs = () => {
    setIsClear({
      isClearTitle: isClear.isClearTitle,
      isClearDesc: true,
    });
    setEnteredDescription("");
  };

  return (
    <Modal
      style={{
        justifyContent: "center",
        borderRadius: 10,
        shadowRadius: 10,
        width: deviceWidth - 50,
        height: 300,
      }}
      position="center"
      backdrop={true}
      ref={forwardRef}
      backdropOpacity={0.8}
      swipeToClose={false}
    >
      <View
        style={{
          backgroundColor: "#FFFFFF",
          height: 350,
          padding: 30,
          borderRadius: 10,
        }}
      >
        <Text heavy large style={{ alignSelf: "center" }}>
          Edit Vocabset Information
        </Text>
        <View style={{ marginTop: 30 }}>
          <Text medium heavy>
            Title{" "}
            <Text medium bold color="red">
              *
            </Text>
          </Text>
          <View style={styles.inputFieldContainer}>
            <TextInput
              style={styles.inputField}
              defaultValue={vocabSet.title}
              value={isClear.isClearTitle === true ? "" : EnteredTitle}
              onChangeText={(text) => onChangeTitle(text)}
              onFocus={() =>
                setIsFocus({
                  isFocusTitle: true,
                })
              }
              onBlur={onBlurTextInput}
            />
            {isFocus.isFocusTitle === true ? (
              <TouchableOpacity onPress={onPressClearTitle}>
                <AntDesign name="closecircle" size={14} color="gray" />
              </TouchableOpacity>
            ) : (
              <View></View>
            )}
          </View>
          {isEmptyTitle === true && (
            <Text style={{ color: "red" }}>Title cannot be empty!</Text>
          )}
        </View>

        <View style={{ marginTop: 30 }}>
          <Text medium heavy>
            Description
          </Text>
          <View style={styles.inputFieldContainer}>
            <TextInput
              style={styles.inputField}
              defaultValue={vocabSet.description}
              value={isClear.isClearDesc === true ? "" : EnteredDescription}
              onChangeText={(text) => onChangeDecs(text)}
              onFocus={() =>
                setIsFocus({
                  isFocusDesc: true,
                })
              }
              onBlur={onBlurTextInput}
            />
            {isFocus.isFocusDesc === true ? (
              <TouchableOpacity onPress={onPressClearDecs}>
                <AntDesign name="closecircle" size={14} color="gray" />
              </TouchableOpacity>
            ) : (
              <View></View>
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 50,
            }}
          >
            <TouchableHighlight
              style={{
                backgroundColor: "#68aaf7",
                padding: 10,
                width: "45%",
                alignItems: "center",
                borderRadius: 10,
              }}
              underlayColor="#388FF4"
              onPress={onClickSave}
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
      </View>
    </Modal>
  );
};

export default EditVocabSetModal;

const styles = StyleSheet.create({
  inputFieldContainer: {
    borderBottomColor: "black",
    borderBottomWidth: 2,
    flexDirection: "row",
    alignItems: "center",
  },

  inputField: {
    width: "94%",
  },
});
