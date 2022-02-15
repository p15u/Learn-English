import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
} from "react-native";
import Text from "../../components/Text";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FirebaseContext } from "../../context/FirebaseContext";
import vocabApi from "../../api/vocabApi";

const deviceWidth = Dimensions.get("window").width;

const PublicVocabSet = ({ publicVocabSet, navigation, indexVocab }) => {
  const [userInfo, setUserInfo] = useState({});
  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await firebase.getUserInfo(publicVocabSet.uid);
        setUserInfo(response);
      } catch (error) {
        console.log("Error @fetchUserInfo: ", error.message);
      }
    };
    fetchUserInfo();
  }, []);

  const getCurrentDate = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();

    return (today = mm + "/" + dd + "/" + yyyy);
  };

  const onPressDetails = () => {
    navigation.navigate("VocabSetStack", {
      screen: "VocabSetDetails",
      params: { home: true, publicVocabSet, username: userInfo.username },
    });
  };
  const onPressLearn = () => {
    navigation.navigate("VocabSetStack", {
      screen: "LearnVocabs",
      params: { home: true, publicVocabSet },
    });
  };
  const onPressTest = () => {
    navigation.navigate("VocabSetStack", {
      screen: "TestVocabsScreen",
      params: { home: true, publicVocabSet },
    });
  };
  const onPressGetVocabSet = () => {
    Alert.alert(
      "Download",
      "Do you want to download this vocabulary set to your repository?",
      [
        {
          text: "Ok",
          style: "Ok",
          onPress: () => {
            handleGetVocabSet();
          },
        },
        {
          text: "Cancel",
          style: "Cancel",
        },
      ]
    );
  };

  const handleGetVocabSet = async () => {
    console.log();
    const uid = await firebase.getCurrentUser().uid;
    const getPublicVocabSet = {
      uid: uid,
      createAt: getCurrentDate(),
      createAtInMills: publicVocabSet.createAtInMills,
      description: publicVocabSet.description,
      title: publicVocabSet.title,
      public: 0,
      vocabs: publicVocabSet.vocabs,
      isFavourite: false,
    };
    const response = await vocabApi.post(getPublicVocabSet);
    Alert.alert(
      "Successful",
      "You have successfully downloaded this vocabulary set.",
      [
        {
          text: "Close",
          style: "cancel",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ position: "absolute", right: 20, top: 15 }}
        onPress={onPressGetVocabSet}
      >
        <FontAwesome name="download" size={20} color="gray" />
      </TouchableOpacity>
      <View style={styles.userContainer}>
        <Image
          style={styles.avatarImg}
          source={
            userInfo.profilePhotoURL === "default"
              ? require("../../../assets/image/avatar.png")
              : { uri: userInfo.profilePhotoURL }
          }
        />
        <View>
          <Text heavy medium>
            {userInfo.username}
          </Text>
          <Text tiny>
            {publicVocabSet.createAt} .{" "}
            <FontAwesome name="globe" color="black" size={14} />
          </Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View>
          <Text style={{ fontStyle: "italic" }}>
            {publicVocabSet.vocabs.length} Term(s)
          </Text>
          <Text medium>Title: {publicVocabSet.title}</Text>
          <Text medium>Description: {publicVocabSet.description}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableHighlight
            style={styles.button}
            underlayColor="#388FF4"
            onPress={onPressDetails}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome name="info-circle" color="#FFFFFF" size={16} />
              <Text medium style={{ color: "#FFFFFF" }}>
                {" "}
                Details
              </Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.button}
            underlayColor="#388FF4"
            onPress={onPressLearn}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome name="pencil" color="#FFFFFF" size={16} />
              <Text medium style={{ color: "#FFFFFF" }}>
                {" "}
                Learn
              </Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.button}
            underlayColor="#388FF4"
            onPress={onPressTest}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome name="check-square-o" color="#FFFFFF" size={18} />
              <Text medium style={{ color: "#FFFFFF" }}>
                {" "}
                Test
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  );
};

export default PublicVocabSet;

const styles = StyleSheet.create({
  container: {
    width: deviceWidth - 10,
    height: 200,
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    borderRadius: 10,
    padding: 10,
  },

  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },

  avatarImg: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 100,
    marginRight: 10,
  },

  contentContainer: {
    flex: 2,
    marginTop: 10,
    justifyContent: "space-between",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  button: {
    backgroundColor: "#68aaf7",
    padding: 5,
    borderRadius: 10,
    width: "32.5%",
    alignItems: "center",
  },
});
