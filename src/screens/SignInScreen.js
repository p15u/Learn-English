import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/native";
import { Image } from "react-native";

import { UserContext } from "../context/UserContext";
import { FirebaseContext } from "../context/FirebaseContext";

import firebase from "firebase";
import * as Google from "expo-google-app-auth";
import * as Facebook from "expo-facebook";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import Text from "../components/Text";
import { validEmail, validPassword } from "../validation/regex";
import LoadingModal from "../components/LoadingModal";

const SignInScreen = ({ navigation }) => {
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);

  const [isEmptyEmail, setIsEmptyEmail] = useState(false);
  const [isEmptyPassword, setIsEmptyPassword] = useState(false);

  const [email, setEnteredEmail] = useState("");
  const [password, setEnteredPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  const [_, setUser] = useContext(UserContext);
  const firebase1 = useContext(FirebaseContext);

  const validate = () => {
    let isValid = true;

    if (validEmail.test(email)) setInvalidEmail(false);
    else {
      setInvalidEmail(true);
      isValid = false;
    }

    if (email == "") {
      setIsEmptyEmail(true);
      isValid = false;
    } else {
      setIsEmptyEmail(false);
      isValid = true;
    }

    if (validPassword.test(password)) setInvalidPassword(false);
    else {
      setInvalidPassword(true);
      isValid = false;
    }

    if (password == "") {
      setIsEmptyPassword(true);
      isValid = false;
    } else {
      setIsEmptyPassword(false);
      isValid = true;
    }

    return isValid;
  };

  // Sign in Facebook
  const logInFacebook = async () => {
    try {
      await Facebook.initializeAsync({
        appId: "770244906991940",
      });
      const result = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile"],
      });
      if (result.type === "success") {
        setLoadingModal(true);
        // Get the user's name using Facebook's Graph API
        onSignInFacebook(result);
        // const response = await fetch(`https://graph.facebook.com/me?fields=name,picture,id&access_token=${result.token}`);
        // response.json().then((result) => console.log('a', result))
      } else {
        // type === 'cancel'
        console.log("cancel");
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  };

  function onSignInFacebook(response) {
    // User is signed-in Facebook.
    var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!isUserEqualFacebook(response, firebaseUser)) {
        // Build Firebase credential with the Facebook auth token.
        var credential = firebase.auth.FacebookAuthProvider.credential(
          response.token
        );

        // Sign in with the credential from the Facebook user.
        firebase
          .auth()
          .signInWithCredential(credential)
          .then(async (result) => {
            console.log("login Facebook successful");

            const user = {
              username: result.additionalUserInfo.profile.name,
              fbid: result.additionalUserInfo.profile.id,
              profilePhotoURL:
                result.additionalUserInfo.profile.picture.data.url,
              uid: result.user.uid,
              method: 2,
            };
            if (result.additionalUserInfo.isNewUser)
              await firebase1.createUserWithFacebookAccount(user);
            else {
              const userData = await firebase1.getUserInfo(result.user.uid);
              user.username = userData.username;
              user.profilePhotoURL = userData.profilePhotoURL;
            }

            setUser({ ...user, isLoggedIn: true });
          })
          .catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            console.log("login Facebook error");
          });
      } else {
        // User is already signed-in Firebase with the correct user.
        console.log("User already signed-in Firebase.");
        setLoadingModal(false);
        alert("Account is signed-in in another device.");
      }
    });
  }

  function isUserEqualFacebook(facebookAuthResponse, firebaseUser) {
    console.log("facebookAuthResponse: ", facebookAuthResponse);
    console.log("firebaseuser: ", firebaseUser);
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
          firebase.auth.FacebookAuthProvider.PROVIDER_ID &&
          providerData[i].uid === facebookAuthResponse.userId
        ) {
          // We don't need to re-auth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }

  // Sign in Google
  const isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
          firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.user.id
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  const onSignIn = (googleUser) => {
    // console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.

        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );

        firebase
          .auth()
          .fetchSignInMethodsForEmail(googleUser.user.email)
          .then((method) => {
            console.log("method: ", method.length);
            if (method.length == 2) {
              firebase
                .auth()
                .signInWithCredential(credential)
                .then(async (result) => {
                  console.log(credential);
                  console.log("login Google successful");
                  const user = {
                    username: result.additionalUserInfo.profile.name,
                    email: result.additionalUserInfo.profile.email,
                    profilePhotoURL: result.additionalUserInfo.profile.picture,
                    uid: result.user.uid,
                    method: 1,
                  };
                  if (result.additionalUserInfo.isNewUser)
                    await firebase1.createUserWithGoogleAccount(user);
                  else {
                    const userData = await firebase1.getUserInfo(
                      result.user.uid
                    );
                    user.username = userData.username;
                    user.profilePhotoURL = userData.profilePhotoURL;
                  }

                  setUser({ ...user, isLoggedIn: true });
                })
                .catch((error) => {
                  // Handle Errors here.
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  // The email of the user's account used.
                  var email = error.email;
                  // The firebase.auth.AuthCredential type that was used.
                  var credential = error.credential;
                  // ...
                  console.log("login Google Error");
                });
            } else if (method.length <= 1) {
              console.log("a");
              navigation.navigate("GoogleSignIn", {
                googleUser,
                credential,
                isExist: method.length == 1 ? true : false,
              });
            }
          })
          .catch((error) => console.log(error));

        // Sign in with credential from the Google user.
      } else {
        console.log("User already signed-in Firebase.");
        setLoadingModal(false);
        firebase1.signOut();
        alert("Account is signed-in in another device.");
      }
    });
  };

  const signInWithGoogleAsync = async () => {
    setLoadingModal(true);
    try {
      const result = await Google.logInAsync({
        androidStandaloneAppClientId: "55896866433-efr93ls98a05o34jnilbnhj6ctun2ksa.apps.googleusercontent.com",
        androidClientId:
          "55896866433-efr93ls98a05o34jnilbnhj6ctun2ksa.apps.googleusercontent.com",
        iosStandaloneAppClientId: "55896866433-u8rka9bk4c1ckbhhiupecuckf10vet99.apps.googleusercontent.com",
        iosClientId:
          "55896866433-u8rka9bk4c1ckbhhiupecuckf10vet99.apps.googleusercontent.com",
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        onSignIn(result);
        return result.accessToken;
      } else {
        setLoadingModal(false);
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

  const SignIn = async () => {
    // Test function, not truly , update after
    var isValidInput = validate();
    // const isValidInput = true;
    if (isValidInput) {
      setLoading(true);

      try {
        const isSignIn = await firebase1.signIn(email, password);

        if (isSignIn) {
          const uid = firebase1.getCurrentUser().uid;

          const userInfo = await firebase1.getUserInfo(uid);

          setUser({
            email: userInfo.email,
            username: userInfo.username,
            uid: uid,
            profilePhotoURL: userInfo.profilePhotoURL,
            isLoggedIn: true,
            method: 0,
          });
        }
      } catch (error) {
        setInvalidEmail(true);
        setInvalidPassword(true);
        console.log(invalidEmail);
        console.log("Error @SignIn: ", error.message);
      }
    }

    setLoading(false);
  };

  return (
    <Container>
      <HeadContainer>
        <Text center heavy title style={{ marginTop: 50 }}>
          engPRO
        </Text>
      </HeadContainer>

      {/* <LoginPanelContainer> */}
      <LoginPanel
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
          SIGNIN TO CONTINUE
        </HeaderTxt>

        <InputForm>
          {loadingModal && <LoadingModal />}
          <Text heavy style={{ marginBottom: 10 }}>
            Email
          </Text>
          <InputFieldContainer>
            <InputField
              placeholder="Enter Email"
              onChangeText={(email) => setEnteredEmail(email)}
              value={email}
            />
          </InputFieldContainer>
          {invalidEmail === true && isEmptyEmail === false ? (
            <Text color="red">Invalid Email.</Text>
          ) : (
            <View></View>
          )}
          {isEmptyEmail === true ? (
            <Text color="red">Email cannot be empty.</Text>
          ) : (
            <View></View>
          )}
          <Text heavy style={{ marginTop: 20, marginBottom: 10 }}>
            Password
          </Text>
          <InputFieldContainer>
            <InputField
              placeholder="Enter Password"
              secureTextEntry={isHidden === true ? true : false}
              onChangeText={(password) => setEnteredPassword(password)}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
            ></InputField>
            {isFocus === true && (
              <HidePassword onPress={() => setIsHidden(!isHidden)}>
                <FontAwesome
                  name={isHidden == true ? "eye" : "eye-slash"}
                  size={22}
                  color="gray"
                />
              </HidePassword>
            )}
          </InputFieldContainer>
          {invalidPassword === true && isEmptyPassword === false ? (
            <Text color="red">Invalid Password.</Text>
          ) : (
            <View></View>
          )}
          {isEmptyPassword === true ? (
            <Text color="red">Password cannot be empty.</Text>
          ) : (
            <View></View>
          )}

          <ForgotPasswordForm
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={{ marginTop: 5 }} color="#4a90e2" right>
              Forgot Password?
            </Text>
          </ForgotPasswordForm>

          <SignInBtn underlayColor="#388FF4" onPress={SignIn} disable={loading}>
            {loading ? (
              <Loading />
            ) : (
              <Text center medium heavy style={{ color: "#fff" }}>
                SIGN IN
              </Text>
            )}
          </SignInBtn>

          <LineContainer>
            <Line />
            <Text large bold center style={{ color: "#68aaf7", width: "20%" }}>
              OR
            </Text>
            <Line />
          </LineContainer>
          <SocialMediaIconContainer>
            <SignInMethod onPress={logInFacebook}>
              <Image
                source={{
                  uri: "https://cdn.iconscout.com/icon/free/png-256/facebook-logo-2019-1597680-1350125.png",
                }}
                style={{ width: 40, height: 40 }}
              />
            </SignInMethod>
            <SignInMethod onPress={signInWithGoogleAsync}>
              <Image
                source={{
                  uri: "https://icons-for-free.com/iconfiles/png/512/Google-1320568266385361674.png",
                }}
                style={{ width: 40, height: 40 }}
              />
            </SignInMethod>
          </SocialMediaIconContainer>
          <SignUp>
            <Text small>Don't have an account? </Text>
            <SignUpBtn onPress={() => navigation.navigate("SignUp")}>
              <Text bold color="#68aaf7">
                Sign up
              </Text>
            </SignUpBtn>
          </SignUp>
        </InputForm>
      </LoginPanel>
      {/* </LoginPanelContainer> */}
    </Container>
  );
};

const Loading = styled.ActivityIndicator.attrs((props) => ({
  color: "#ffffff",
  size: "small",
}))``;

const View = styled.View``;

const ForgotPasswordForm = styled.TouchableOpacity``;

const SignInMethod = styled.TouchableOpacity``;

const HidePassword = styled.TouchableOpacity``;

const Container = styled.View`
  flex: 1;
`;

const HeadContainer = styled.View`
  height: 40%;
  background-color: #6eecfb;
`;

const LoginPanel = styled.View`
  background-color: #ffffff;
  width: 300px;
  border-radius: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -240px;
  margin-left: -150px;
`;

const HeaderTxt = styled(Text)`
  margin-top: 30px;
`;

const InputForm = styled.View`
  padding: 20px;
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

const SignInBtn = styled.TouchableHighlight`
  padding: 10px;
  background-color: #68aaf7;
  border-radius: 20px;
  border-color: #fff;
  margin-top: 30px;
`;

const LineContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
`;

const Line = styled.View`
  border-bottom-color: #68aaf7;
  border-bottom-width: 1px;
  width: 40%;
`;

const SocialMediaIconContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-top: 20px;
`;

const SignUp = styled.View`
  margin-top: 20px;
  justify-content: center;
  flex-direction: row;
  align-items: flex-end;
`;

const SignUpBtn = styled.TouchableOpacity`
  justify-content: center;
`;

export default SignInScreen;
