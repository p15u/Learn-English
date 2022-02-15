import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
} from "react-native";
import styled from "styled-components";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import { FirebaseContext } from "../context/FirebaseContext";
import { UserContext } from "../context/UserContext";
import LoadingModal from "../components/LoadingModal";
import { validPassword, validName } from "../validation/regex";

import Header from "../components/Header";

const DetailsProfileScreen = ({ route, navigation }) => {
  const { isEmail } = route.params;
  const { isUsername } = route.params;
  const { isPassword } = route.params;
  const { email } = route.params;
  const { username } = route.params;

  const [isFocus, setIsFocus] = useState({
    isFocus1: false,
    isFocusNewPass: false,
    isFocusConfirmPass: false,
  });
  const [isHidden, setIsHidden] = useState({
    isHiddenPassword: true,
    isHiddenNewPass: true,
    isHiddenConfirmPass: true,
  });

  const [isClear, setIsClear] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);

  const [isDetailProfile, setIsDetailProfile] = useState(true);

  const [enteredOldPassword, setEnteredOldPassword] = useState("");
  const [enteredNewPassword, setEnteredNewPassword] = useState("");
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");
  const [enteredUsername, setEnteredUsername] = useState(username);

  const [inCorrectOldPass, setInCorrectOldPass] = useState(false);
  const [inValidNewPass, setInValidNewPass] = useState(false);
  const [inValidConfirmPass, setInValidConfirmPass] = useState(false);

  const [isInValidUsername, setIsInValidUsername] = useState(false);
  const [isEmptyUsename, setIsEmptyUsename] = useState(false);

  const [isOldPassEmpty, setIsOldPassEmpty] = useState(false);
  const [isNewPassEmpty, setIsNewPassEmpty] = useState(false);
  const [isConfirmPassEmpty, setIsConfirmPassEmpty] = useState(false);

  const firebase = useContext(FirebaseContext);
  const [user, setUser] = useContext(UserContext);

  const validatePassword = () => {
    let isValid = false;
    if (enteredOldPassword == "") {
      setIsOldPassEmpty(true);
      isValid = false;
    } else {
      setIsOldPassEmpty(false);
      isValid = true;
    }

    if (enteredNewPassword == "") {
      setIsNewPassEmpty(true);
      isValid = false;
    } else {
      setIsNewPassEmpty(false);
      isValid = true;
    }

    if (validPassword.test(enteredNewPassword)) {
      setInValidNewPass(false);
      isValid = true;
    } else {
      setInValidNewPass(true);
      isValid = false;
    }

    if (enteredConfirmPassword != enteredNewPassword) {
      setInValidConfirmPass(true);
      isValid = false;
    } else {
      setInValidConfirmPass(false);
      isValid = true;
    }

    if (enteredConfirmPassword == "") {
      setIsConfirmPassEmpty(true);
      isValid = false;
    } else {
      setIsConfirmPassEmpty(false);
      isValid = true;
    }
    return isValid;
  };

  const validateUsername = () => {
    let isValid = false;
    if (enteredUsername == "") {
      setIsEmptyUsename(true);
      isValid = false;
    } else {
      setIsEmptyUsename(false);
      isValid = true;
    }

    if (validName.test(enteredUsername)) {
      setIsInValidUsername(false);
      isValid = true;
    } else {
      setIsInValidUsername(true);
      isValid = false;
    }
    return isValid;
  };

  const onPressSave = () =>
    Alert.alert(
      "Confirm Alert",
      isEmail === true
        ? "Do you want to change email?"
        : isUsername === true
        ? "Do you want to change username?"
        : "Do you want to change password?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            isPassword
              ? onClickChagePassword()
              : isUsername
              ? onClickChangeUsername()
              : "";
          },
        },
      ]
    );

  const onClickChagePassword = async () => {
    setLoadingModal(true);
    var isValid = validatePassword();
    if (isValid == true) {
      try {
        const isSignIn = await firebase.signIn(user.email, enteredOldPassword);

        if (isSignIn) {
          const isChangePassword = await firebase.changePassword(
            enteredNewPassword
          );

          Alert.alert("Confirm Alert", "You have changed your password!"),
            [
              {
                text: "Cancel",
                style: "cancel",
              },
            ];

          isChangePassword && navigation.navigate("ProfileScreen");
        }
      } catch (error) {
        setInCorrectOldPass(true);
        console.log("Invalid current password !");
      }
    }
    setLoadingModal(false);
  };

  const onClickChangeUsername = async () => {
    setLoadingModal(true);
    var isValid = validateUsername();
    if (isValid == true) {
      await firebase.updateUser({ username: enteredUsername });
      setUser({ ...user, username: enteredUsername });
      navigation.navigate("ProfileScreen");
    }
    setLoadingModal(false);
  };

  const onBlurTextInput = () => {
    setIsFocus({
      isFocus1: false,
      isFocusNewPass: false,
      isFocusConfirmPass: false,
    });
  };

  const onPressClear = () => {
    setIsClear(true);
    setEnteredUsername("");
  };

  const onChangeUserName = (text) => {
    setEnteredUsername(text);
    setIsClear(false);
  };

  return (
    <View style={styles.container}>
      <Header
        navigation={navigation}
        isDetailProfile={isDetailProfile}
        isEmail={isEmail}
        isUsername={isUsername}
        isPassword={isPassword}
      />
      <View style={styles.contentContainer}>
        <View>
          {loadingModal === true && <LoadingModal />}
          <View style={styles.inputFieldContainer}>
            <TextInput
              style={styles.inputField}
              defaultValue={
                isEmail === true ? email : isUsername === true ? username : ""
              }
              value={
                isUsername === true && isClear === true ? "" : enteredUsername
              }
              placeholder={
                isEmail === true
                  ? "Enter new email"
                  : isUsername === true
                  ? "Enter new username"
                  : "Enter current password"
              }
              editable={isEmail === true ? false : true}
              secureTextEntry={
                isPassword === true && isHidden.isHiddenPassword === true
                  ? true
                  : isPassword === true && isHidden.isHiddenPassword === false
                  ? false
                  : false
              }
              onChangeText={(text) => {
                isPassword === true
                  ? setEnteredOldPassword(text)
                  : isUsername === true
                  ? onChangeUserName(text)
                  : "";
              }}
              onFocus={() =>
                setIsFocus({
                  isFocus1: true,
                })
              }
              onBlur={onBlurTextInput}
            />
            {isFocus.isFocus1 === true && isUsername === true ? (
              <TouchableOpacity onPress={onPressClear}>
                <AntDesign name="closecircle" size={14} color="gray" />
              </TouchableOpacity>
            ) : isFocus.isFocus1 === true && isPassword === true ? (
              <TouchableOpacity
                onPress={() =>
                  setIsHidden({
                    isHiddenPassword: !isHidden.isHiddenPassword,
                    isHiddenNewPass: isHidden.isHiddenNewPass,
                    isHiddenConfirmPass: isHidden.isHiddenConfirmPass,
                  })
                }
              >
                <FontAwesome
                  name={isHidden.isHiddenPassword == true ? "eye" : "eye-slash"}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            ) : (
              <View></View>
            )}
          </View>

          {isUsername === true && isEmptyUsename === true ? (
            <Text
              style={{
                color: "red",
                marginTop: -30,
                marginBottom: 30,
                paddingLeft: 5,
              }}
            >
              Username cannot be empty
            </Text>
          ) : isUsername === true && isInValidUsername === true ? (
            <Text
              style={{
                color: "red",
                marginTop: -30,
                marginBottom: 30,
                paddingLeft: 5,
              }}
            >
              Invalid username
            </Text>
          ) : (
            <View></View>
          )}

          {isPassword === true &&
          inCorrectOldPass === true &&
          isOldPassEmpty === false ? (
            <Text
              style={{
                color: "red",
                marginTop: -30,
                marginBottom: 30,
                paddingLeft: 5,
              }}
            >
              Wrong current password
            </Text>
          ) : isPassword && isOldPassEmpty === true ? (
            <Text
              style={{
                color: "red",
                marginTop: -30,
                marginBottom: 30,
                paddingLeft: 5,
              }}
            >
              Current password cannot be empty
            </Text>
          ) : (
            <View></View>
          )}
        </View>

        {isPassword === true ? (
          <View>
            <View>
              <View style={styles.inputFieldContainer}>
                <TextInput
                  style={styles.inputField}
                  placeholder="Enter new password"
                  secureTextEntry={
                    isHidden.isHiddenNewPass === true ? true : false
                  }
                  onChangeText={(text) => setEnteredNewPassword(text)}
                  onFocus={() =>
                    setIsFocus({
                      isFocus1: false,
                      isFocusNewPass: true,
                      isFocusConfirmPass: false,
                    })
                  }
                  onBlur={onBlurTextInput}
                />
                {isFocus.isFocusNewPass === true ? (
                  <TouchableOpacity
                    onPress={() =>
                      setIsHidden({
                        isHiddenPassword: isHidden.isHiddenPassword,
                        isHiddenNewPass: !isHidden.isHiddenNewPass,
                        isHiddenConfirmPass: isHidden.isHiddenConfirmPass,
                      })
                    }
                  >
                    <FontAwesome
                      name={
                        isHidden.isHiddenNewPass == true ? "eye" : "eye-slash"
                      }
                      size={20}
                      color="gray"
                    />
                  </TouchableOpacity>
                ) : (
                  <View></View>
                )}
              </View>

              {inValidNewPass === true && isNewPassEmpty === false ? (
                <Text
                  style={{
                    color: "red",
                    marginTop: -30,
                    marginBottom: 30,
                    paddingLeft: 5,
                  }}
                >
                  Password must have at least 6 characters, contain at least 1
                  numeric digit, 1 uppercase and 1 lowercase
                </Text>
              ) : isNewPassEmpty === true ? (
                <Text
                  style={{
                    color: "red",
                    marginTop: -30,
                    marginBottom: 30,
                    paddingLeft: 5,
                  }}
                >
                  New password cannot be empty
                </Text>
              ) : (
                <View></View>
              )}
            </View>

            <View>
              <View style={styles.inputFieldContainer}>
                <TextInput
                  style={styles.inputField}
                  placeholder="Confirm new password"
                  secureTextEntry={
                    isHidden.isHiddenConfirmPass === true ? true : false
                  }
                  onChangeText={(text) => setEnteredConfirmPassword(text)}
                  onFocus={() =>
                    setIsFocus({
                      isFocus1: false,
                      isFocusNewPass: false,
                      isFocusConfirmPass: true,
                    })
                  }
                  onBlur={onBlurTextInput}
                />
                {isFocus.isFocusConfirmPass === true ? (
                  <TouchableOpacity
                    onPress={() =>
                      setIsHidden({
                        isHiddenPassword: isHidden.isHiddenPassword,
                        isHiddenNewPass: isHidden.isHiddenNewPass,
                        isHiddenConfirmPass: !isHidden.isHiddenConfirmPass,
                      })
                    }
                  >
                    <FontAwesome
                      name={
                        isHidden.isHiddenConfirmPass == true
                          ? "eye"
                          : "eye-slash"
                      }
                      size={20}
                      color="gray"
                    />
                  </TouchableOpacity>
                ) : (
                  <View></View>
                )}
              </View>
            </View>
            {inValidConfirmPass === true && isConfirmPassEmpty === false ? (
              <Text
                style={{
                  color: "red",
                  marginTop: -30,
                  marginBottom: 30,
                  paddingLeft: 5,
                }}
              >
                Confirm password does not match new password
              </Text>
            ) : isConfirmPassEmpty === true ? (
              <Text
                style={{
                  color: "red",
                  marginTop: -30,
                  marginBottom: 30,
                  paddingLeft: 5,
                }}
              >
                Confirm password cannot be empty
              </Text>
            ) : (
              <View></View>
            )}
          </View>
        ) : (
          <View></View>
        )}
        {isEmail === true ? (
          <View></View>
        ) : (
          <TouchableHighlight
            underlayColor="#388FF4"
            style={styles.saveBtn}
            onPress={onPressSave}
          >
            <Text
              style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "bold" }}
            >
              Save
            </Text>
          </TouchableHighlight>
        )}
      </View>
    </View>
  );
};

const Loading = styled.ActivityIndicator.attrs((props) => ({
  color: "#ffffff",
  size: "small",
}))``;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentContainer: {
    padding: 20,
  },

  inputFieldContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "black",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },

  inputField: {
    paddingLeft: 5,
    width: "93%",
    paddingBottom: 5,
    height: 30,
  },

  saveBtn: {
    backgroundColor: "#68aaf7",
    padding: 10,
    width: "100%",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
  },
});

export default DetailsProfileScreen;
