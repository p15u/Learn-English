import React, { useContext, useState } from "react";
import styled from "styled-components";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

import { FirebaseContext } from "../context/FirebaseContext";
import { UserContext } from "../context/UserContext";

import Text from "../components/Text";
import { validEmail, validPassword, validName } from "../validation/regex";

const SignUpScreen = ({ navigation }) => {
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [invalidConfirmPassword, setInvalidConfirmPassword] = useState(false);
  const [invalidName, setInvalidName] = useState(false);

  const [isEmptyEmail, setIsEmptyEmail] = useState(false);
  const [isEmptyPassword, setIsEmptyPassword] = useState(false);
  const [isEmptyConfirmPassword, setIsEmptyConfirmPassword] = useState(false);
  const [isEmptyName, setIsEmptyName] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEnteredEmail] = useState("");
  const [password, setEnteredPassword] = useState("");
  const [confirmPassword, setEnteredConfirmPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  const [isFocus, setIsFocus] = useState({
    isFocusPassWord: false,
    isFocusConfirmPassword: false,
  });
  const [isHidden, setIsHidden] = useState({
    isHiddenPassWord: true,
    isHiddenConfirmPassword: true,
  });

  const [loading, setLoading] = useState(false);
  const firebase = useContext(FirebaseContext);
  const [_, setUser] = useContext(UserContext);

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

  const validate = () => {
    let isValid = true;

    if (validEmail.test(email)) {
      setInvalidEmail(false);
    } else {
      setInvalidEmail(true);
      isValid = false;
    }

    if (email == "") {
      setIsEmptyEmail(true);
      isValid = false;
    } else {
      setIsEmptyEmail(false);
    }

    if (validPassword.test(password)) {
      setInvalidPassword(false);
    } else {
      setInvalidPassword(true);
      isValid = false;
    }

    if (password == "") {
      setIsEmptyPassword(true);
      isValid = false;
    } else {
      setIsEmptyPassword(false);
    }

    if (confirmPassword == password) {
      setInvalidConfirmPassword(false);
    } else {
      setInvalidConfirmPassword(true);
      isValid = false;
    }

    if (confirmPassword == "") {
      setIsEmptyConfirmPassword(true);
      isValid = false;
    } else {
      setIsEmptyConfirmPassword(false);
    }

    if (validName.test(username)) {
      setInvalidName(false);
    } else {
      setInvalidName(true);
      isValid = false;
    }

    if (username == "") {
      setIsEmptyName(true);
      isValid = false;
    } else {
      setIsEmptyName(false);
    }

    return isValid;
  };

  const signUp = async () => {
    const isValidInput = validate();

    if (isValidInput == true) {
      setLoading(true);

      const user = {
        username,
        email,
        password,
        profilePhoto,
      };

      try {
        const createdUser = await firebase.createUser(user);
        if (createdUser == false) {
          setInvalidEmail(true);
        } else {
          setUser({ ...createdUser, isLoggedIn: true });
        }
      } catch (error) {
        console.log("Error @SignUp: ", error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container>
      <HeadContainer>
        <Text center heavy title style={{ marginTop: 50 }}>
          engPRO
        </Text>
      </HeadContainer>

      <SignUpPanel
        style={{
          shadowColor: "#888888",
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.51,
          shadowRadius: 13.16,

          elevation: 20,
        }}
      >
        <HeaderTxt center heavy medium>
          SIGN UP
        </HeaderTxt>

        <ProfilePhotoContainer
          underlayColor="#c5c7cf"
          onPress={addProfilePhoto}
        >
          {profilePhoto ? (
            <ProfilePhoto source={{ uri: profilePhoto }} />
          ) : (
            <DefaultProfilePhoto>
              <AntDesign name="camera" size={24} color="#ffffff" />
            </DefaultProfilePhoto>
          )}
        </ProfilePhotoContainer>

        <InputForm>
          <Text heavy style={{ marginBottom: 10 }}>
            Email <Text style={{ color: "red" }}>*</Text>
          </Text>

          <InputFieldContainer>
            <InputField
              placeholder="Email"
              onChangeText={(email) => setEnteredEmail(email)}
              value={email}
            ></InputField>
          </InputFieldContainer>
          {invalidEmail === true && isEmptyEmail === false ? (
            <Text color="red" style={{ fontSize: 12 }}>
              Invalid Email.
            </Text>
          ) : (
            <View></View>
          )}
          {isEmptyEmail === true ? (
            <Text color="red" style={{ fontSize: 12 }}>
              Email cannot be empty.
            </Text>
          ) : (
            <View></View>
          )}

          <Text heavy style={{ marginTop: 15, marginBottom: 10 }}>
            Username <Text style={{ color: "red" }}>*</Text>
          </Text>
          <InputFieldContainer>
            <InputField
              placeholder="Username"
              onChangeText={(username) => setUsername(username)}
              value={username}
            ></InputField>
          </InputFieldContainer>
          {invalidName === true && isEmptyName === false ? (
            <Text color="red" style={{ fontSize: 12 }}>
              Username must contain at least 5 characters, cannot contain
              special characters.
            </Text>
          ) : (
            <View></View>
          )}
          {isEmptyName === true ? (
            <Text color="red" style={{ fontSize: 12 }}>
              Name cannot be empty.
            </Text>
          ) : (
            <View></View>
          )}

          <Text heavy style={{ marginTop: 15, marginBottom: 10 }}>
            Password <Text style={{ color: "red" }}>*</Text>
          </Text>

          <InputFieldContainer>
            <InputField
              placeholder="Password"
              secureTextEntry={
                isHidden.isHiddenPassWord === true ? true : false
              }
              onChangeText={(password) => setEnteredPassword(password)}
              value={password}
              onFocus={() =>
                setIsFocus({
                  isFocusPassWord: true,
                  isFocusConfirmPassword: false,
                })
              }
              onBlur={() =>
                setIsFocus({
                  isFocusPassWord: false,
                  isFocusConfirmPassword: false,
                })
              }
            ></InputField>
            {isFocus.isFocusPassWord === true ? (
              <HidePassword
                onPress={() =>
                  setIsHidden({
                    isHiddenPassWord: !isHidden.isHiddenPassWord,
                    isHiddenConfirmPassword: isHidden.isHiddenConfirmPassword,
                  })
                }
              >
                <FontAwesome
                  name={isHidden.isHiddenPassWord == true ? "eye" : "eye-slash"}
                  size={22}
                  color="gray"
                />
              </HidePassword>
            ) : (
              <View></View>
            )}
          </InputFieldContainer>
          {invalidPassword && isEmptyPassword === false ? (
            <Text color="red" style={{ fontSize: 12 }}>
              Password must contain at least 6 characters, 1 uppercase letter
              and 1 numeric.
            </Text>
          ) : (
            <View></View>
          )}
          {isEmptyPassword === true ? (
            <Text color="red" style={{ fontSize: 12 }}>
              Password cannot be empty.
            </Text>
          ) : (
            <View></View>
          )}
          <Text heavy style={{ marginTop: 15, marginBottom: 10 }}>
            Confirm Password <Text style={{ color: "red" }}>*</Text>
          </Text>

          <InputFieldContainer>
            <InputField
              placeholder="Confirm Password"
              secureTextEntry={
                isHidden.isHiddenConfirmPassword === true ? true : false
              }
              onChangeText={(confirmPassword) =>
                setEnteredConfirmPassword(confirmPassword)
              }
              value={confirmPassword}
              onFocus={() =>
                setIsFocus({
                  isFocusPassWord: false,
                  isFocusConfirmPassword: true,
                })
              }
              onBlur={() =>
                setIsFocus({
                  isFocusPassWord: false,
                  isFocusConfirmPassword: false,
                })
              }
            ></InputField>
            {isFocus.isFocusConfirmPassword === true ? (
              <HidePassword
                onPress={() =>
                  setIsHidden({
                    isHiddenPassWord: isHidden.isHiddenPassWord,
                    isHiddenConfirmPassword: !isHidden.isHiddenConfirmPassword,
                  })
                }
              >
                <FontAwesome
                  name={
                    isHidden.isHiddenConfirmPassword == true
                      ? "eye"
                      : "eye-slash"
                  }
                  size={22}
                  color="gray"
                />
              </HidePassword>
            ) : (
              <View></View>
            )}
          </InputFieldContainer>
          {invalidConfirmPassword && isEmptyConfirmPassword === false ? (
            <Text color="red" style={{ fontSize: 12 }}>
              Confirm password does not match password.
            </Text>
          ) : (
            <View></View>
          )}

          {isEmptyConfirmPassword === true ? (
            <Text color="red" style={{ fontSize: 12 }}>
              Confirm password cannot be empty.
            </Text>
          ) : (
            <View></View>
          )}

          <SignUpBtn disable={loading} underlayColor="#388FF4" onPress={signUp}>
            {loading ? (
              <Loading />
            ) : (
              <Text center medium heavy color="#ffffff">
                SIGN UP
              </Text>
            )}
          </SignUpBtn>

          <SignInContainer>
            <Text center>Already have an account? </Text>

            <SignIn onPress={() => navigation.navigate("SignIn")}>
              <Text bold style={{ color: "#4a90e2" }}>
                Sign In
              </Text>
            </SignIn>
          </SignInContainer>
        </InputForm>
      </SignUpPanel>
    </Container>
  );
};

const Loading = styled.ActivityIndicator.attrs((props) => ({
  color: "#ffffff",
  size: "small",
}))``;

const View = styled.View``;

const HidePassword = styled.TouchableOpacity``;

const Container = styled.View`
  flex: 1;
`;

const HeadContainer = styled.View`
  height: 40%;
  background-color: #6eecfb;
`;

const ProfilePhotoContainer = styled.TouchableHighlight`
  background-color: #e1e2e6;
  width: 80px;
  height: 80px;
  border-radius: 40px;
  align-self: center;
  margin-top: 16px;
  overflow: hidden;
`;

const ProfilePhoto = styled.Image`
  flex: 1;
`;

const DefaultProfilePhoto = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const SignUpPanel = styled.View`
  background-color: #ffffff;
  width: 300px;
  border-radius: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -285px;
  margin-left: -150px;
`;

const HeaderTxt = styled(Text)`
  margin-top: 30px;
`;

const InputForm = styled.View`
  padding: 20px;
  padding-bottom: 15px;
`;

const InputFieldContainer = styled.View`
  border-bottom-color: black;
  border-bottom-width: 1px;
  flex-direction: row;
  align-items: center;
`;

const InputField = styled.TextInput`
  width: 90%;
`;

const SignUpBtn = styled.TouchableHighlight`
  padding: 10px;
  background-color: #68aaf7;
  border-radius: 20px;
  border-color: #fff;
  margin-top: 30px;
`;

const SignInContainer = styled.View`
  margin-top: 30px;
  justify-content: center;
  flex-direction: row;
  align-items: flex-end;
`;

const SignIn = styled.TouchableOpacity``;

export default SignUpScreen;
