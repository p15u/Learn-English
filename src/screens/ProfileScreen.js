import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
} from "react-native";
import { UserContext } from "../context/UserContext";
import { FirebaseContext } from "../context/FirebaseContext";
import { AntDesign } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

import vocabApi from "../api/vocabApi";

import Text from "../components/Text";

const ProfileScreen = ({ navigation }) => {
  const [numberOfPosts, setNumberOfPosts] = useState(0);
  const [publicPosts, setPublicPosts] = useState(0);
  const [numberOfVocabs, setNumberOfVocabs] = useState(0);

  const firebase = useContext(FirebaseContext);
  const [user, setUser] = useContext(UserContext);

  useEffect(() => {
    const fetchVocabSetList = async () => {
      var sum = 0;
      try {
        const userData = await firebase.getUserInfo(user.uid);
        const response = await vocabApi.getAll({
          uid: user.uid,
        });
        response.forEach((item) => {
          sum += item.vocabs.length;
        });
        setPublicPosts(userData.public);
        setNumberOfPosts(response.length);
        setNumberOfVocabs(sum);
      } catch (error) {
        console.log("Error @fetchVocabSetList3: ", error.message);
      }
      {
      }
    };
    fetchVocabSetList();
  }, []);

  const createTwoButtonAlert = () =>
    Alert.alert("Confirm logout", "Do you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "OK", onPress: () => signOut() },
    ]);

  const signOut = async () => {
    const isSignOut = await firebase.signOut();

    if (isSignOut) {
      setUser((state) => ({ ...state, isLoggedIn: false }));
    }
  };

  const handleOnPressEmail = () => {
    navigation.navigate("DetailsProfileScreen", {
      isEmail: true,
      email: user.email,
    });
  };

  const handleOnPressUsername = () => {
    navigation.navigate("DetailsProfileScreen", {
      isUsername: true,
      username: user.username,
    });
  };

  const handleOnPressPassword = () => {
    navigation.navigate("DetailsProfileScreen", {
      isPassword: true,
    });
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
        let url = await firebase.uploadProfilePhoto(result.uri);
        setUser({ ...user, profilePhotoURL: url });
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text heavy center style={{ fontSize: 28 }}>
          Profile
        </Text>
      </View>
      <ScrollView>
        <View style={styles.userInfoContainer}>
          <View>
            <Image
              style={styles.userImg}
              source={
                user.profilePhotoURL === "default"
                  ? require("../../assets/image/avatar.png")
                  : { uri: user.profilePhotoURL }
              }
            />
            <TouchableHighlight
              style={{
                backgroundColor: "#68aaf7",
                position: "absolute",
                borderRadius: 100,
                padding: 3,
                left: 70,
                top: 60,
                borderColor: "#FFFFFF",
                borderWidth: 2,
              }}
              underlayColor="#388FF4"
              onPress={addProfilePhoto}
            >
              <AntDesign name="camera" size={14} color="#FFFFFF" />
            </TouchableHighlight>

            <Text heavy large>
              {user.username}
            </Text>
          </View>
        </View>
        <View style={styles.infoBarContainer}>
          <View style={styles.infoBarHolder}>
            <Text heavy medium>
              {numberOfPosts}
            </Text>
            <Text>Posts</Text>
          </View>
          <View style={styles.infoBarHolder}>
            <Text heavy medium>
              {publicPosts}
            </Text>
            <Text>Public Posts</Text>
          </View>
          <View style={styles.infoBarHolder}>
            <Text heavy medium>
              {numberOfVocabs}
            </Text>
            <Text>Vocabularies</Text>
          </View>
        </View>
        <View style={styles.contentBox}>
          <View>
            <Text heavy medium>
              Account Type
            </Text>
            <Text>Free</Text>
          </View>
          <TouchableOpacity style={styles.upgradeBtn}>
            <Text style={{ color: "#FFFFFF" }}>Upgrade Account</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contentBox2}>
          <TouchableOpacity
            style={styles.detailBox}
            onPress={handleOnPressEmail}
            disabled={user.method === 2}
          >
            <Text heavy medium>
              Email
            </Text>
            <Text medium style={{ alignSelf: "center" }}>
              {user.email} <AntDesign name="right" size={14} color="gray" />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.detailBox}
            onPress={handleOnPressUsername}
          >
            <Text heavy medium>
              Username
            </Text>
            <Text medium style={{ alignSelf: "center" }}>
              {user.username} <AntDesign name="right" size={14} color="gray" />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.detailBox}
            onPress={handleOnPressPassword}
            disabled={user.method === 2}
          >
            <Text heavy medium>
              Change Password
            </Text>
            <Text medium style={{ alignSelf: "center" }}>
              <AntDesign name="right" size={14} color="gray" />
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentBox2}>
          <TouchableOpacity style={styles.detailBox}>
            <Text heavy medium>
              Help Center
            </Text>
            <AntDesign
              style={{ alignSelf: "center" }}
              name="right"
              size={14}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.contentBox2}>
          <TouchableOpacity style={styles.detailBox}>
            <Text heavy medium>
              About us
            </Text>
            <AntDesign
              style={{ alignSelf: "center" }}
              name="right"
              size={14}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.contentBox2}>
          <TouchableOpacity
            style={styles.detailBox}
            onPress={createTwoButtonAlert}
          >
            <Text heavy medium style={{ color: "#F24444" }}>
              Log out
            </Text>
            <AntDesign
              style={{ alignSelf: "center" }}
              name="right"
              size={14}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    width: "100%",
    paddingTop: 50,
    paddingLeft: 20,
    paddingBottom: 20,
  },

  userInfoContainer: {
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    paddingBottom: 20,
    padding: 20,
    paddingTop: 0,
    flexDirection: "row",
  },

  userImg: {
    borderRadius: 500,
    width: 90,
    height: 90,
    marginBottom: 10,
    borderColor: "black",
    borderWidth: 1,
  },

  infoBarContainer: {
    flexDirection: "row",
    position: "absolute",
    right: 0,
    top: 20,
  },

  infoBarHolder: {
    alignItems: "center",
    marginRight: 15,
  },

  contentBox: {
    backgroundColor: "#E6E6E6",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
  },

  contentBox2: {
    backgroundColor: "#E6E6E6",
    marginTop: 30,
    borderTopColor: "gray",
    borderTopWidth: 1,
  },

  detailBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
  },

  upgradeBtn: {
    backgroundColor: "#4a90e2",
    borderRadius: 10,
    padding: 10,
    color: "#FFFFFF",
  },
});

export default ProfileScreen;
