import React, { useState, useContext } from "react";
import { LogBox, View } from "react-native";

import styled from "styled-components";

import { FirebaseContext } from "../context/FirebaseContext";
import { UserContext } from "../context/UserContext";
import { FontAwesome } from "@expo/vector-icons";

import Text from "../components/Text";

const GoogleSignInScreen = ({ navigation, route }) => {
  LogBox.ignoreLogs([
    "Non-serializable values were found in the navigation state",
  ]);

  const [password, setEnteredPassword] = useState("");
  const [confirmPassword, setEnteredConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [isEmptyPassword, setIsEmptyPassword] = useState(false);

  const [isFocusConfirmPass, setIsFocusConfirmPass] = useState(false);
  const [isHiddenConfirmPass, setIsHiddenConfirmPass] = useState(true);
  const [isEmptyConfirmPassword, setIsEmptyConfirmPassword] = useState(false);
  const [isNotMatchConfirmPassword, setIsNotMatchConfirmPassword] =
    useState(false);

  const [isExistAccount, setIsExistAccount] = useState(route.params.isExist);

  const firebase1 = useContext(FirebaseContext);
  const [_, setUser] = useContext(UserContext);

  const validate = () => {
    let isValid = true;
    if (password == "") {
      setIsEmptyPassword(true);
      isValid = false;
    } else {
      setIsEmptyPassword(false);
    }

    if (confirmPassword == "" && isExistAccount == false) {
      setIsEmptyConfirmPassword(true);
      isValid = false;
    } else {
      setIsEmptyConfirmPassword(false);
    }

    if (confirmPassword != password && isExistAccount == false) {
      setIsNotMatchConfirmPassword(true);
      isValid = false;
    } else {
      setIsNotMatchConfirmPassword(false);
    }

    return isValid;
  };

  const sendPassword = async () => {
    const validForm = validate();

    if (validForm == true) {
      setLoading(true);
      // console.log('googleUser: ', route.params.googleUser)
      try {
        const credential = route.params.credential;
        const googleUser = route.params.googleUser;
        var user = {
          email: googleUser.user.email,
          password,
          username: googleUser.user.name,
          profilePhotoURL: "",
        };
        const createUser = await firebase1.createUser(user);
        // Account has existed
        if (!createUser) {
          const isSignIn = await firebase1.signIn(user.email, user.password);
          if (isSignIn) {
            var userData = await firebase1.getCurrentUser();
            var uid = userData.uid;
            var userInfo = await firebase1.getUserInfo(uid);

            user = {
              email: userInfo.email,
              username: userInfo.username,
              profilePhotoURL: userInfo.profilePhotoURL,
              uid,
              isLoggedIn: true,
              method: 0,
            };

            setUser(user);
          }
        }

        // Account has created successfully
        else {
          console.log("voday2");

          setUser({
            ...createUser,
            isLoggedIn: true,
            profilePhotoURL: googleUser.user.photoUrl,
            method: 0
          });
          await firebase1.updateUser({
            profilePhotoURL: googleUser.user.photoUrl,
          });
          var userData = await firebase1.getCurrentUser();
        }
        userData
          .linkWithCredential(credential)
          .then((usercred) => {
            var user = usercred.user;
            console.log("Account linking success", user);
          })
          .catch((error) => {
            console.log("Account linking error", error);
          });
      } catch (error) {
        console.log("Error @passwordGoogleSignIn: ", error.message);
        alert("Password is not match.");
      }
      setLoading(false);
    }
  };

  return (
    <Container>
      <HeadContainer>
        <Text center heavy title style={{ marginTop: 50 }}>
          engPRO
        </Text>
      </HeadContainer>

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
          ENTER PASSWORD
        </HeaderTxt>

        <InputForm>
          {isExistAccount === true ? (
            <Text center small style={{ marginBottom: 20 }}>
              This email address is already used to register for our app, to
              continue you must enter the correct created password of the email
              address
            </Text>
          ) : (
            <Text center small style={{ marginBottom: 20 }}>
              Please create password to continue
            </Text>
          )}
          <Text heavy>Password</Text>
          <InputFieldContainer>
            <InputField
              placeholder="Enter password"
              onChangeText={setEnteredPassword}
              secureTextEntry={isHidden === true ? true : false}
              value={password}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
            />

            {/* {password === "" && <Text color="red">Invalid Password.</Text>} */}
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
          {isExistAccount == true && (
            <ForgotPasswordForm
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={{ marginTop: 5 }} color="#4a90e2" right>
                Forgot Password?
              </Text>
            </ForgotPasswordForm>
          )}
          {isEmptyPassword === true && (
            <Text color="red">Password cannot be empty.</Text>
          )}

          {isExistAccount == false && (
            <View>
              <Text heavy style={{ marginTop: 20 }}>
                Confirm Password
              </Text>
              <InputFieldContainer>
                <InputField
                  placeholder="Enter confirm password"
                  onChangeText={setEnteredConfirmPassword}
                  secureTextEntry={isHiddenConfirmPass === true ? true : false}
                  value={confirmPassword}
                  onFocus={() => setIsFocusConfirmPass(true)}
                  onBlur={() => setIsFocusConfirmPass(false)}
                />

                {/* {password === "" && <Text color="red">Invalid Password.</Text>} */}
                {isFocusConfirmPass === true && (
                  <HidePassword
                    onPress={() => setIsHiddenConfirmPass(!isHiddenConfirmPass)}
                  >
                    <FontAwesome
                      name={isHidden == true ? "eye" : "eye-slash"}
                      size={22}
                      color="gray"
                    />
                  </HidePassword>
                )}
              </InputFieldContainer>
            </View>
          )}

          {isEmptyConfirmPassword === true && isExistAccount == false && (
            <Text color="red">Confirm Password cannot be empty.</Text>
          )}
          {isNotMatchConfirmPassword === true && isExistAccount == false && (
            <Text color="red">Confirm Password is not match password.</Text>
          )}

          <SignInBtn
            underlayColor="#388FF4"
            onPress={sendPassword}
            disable={loading}
          >
            {loading ? (
              <Loading />
            ) : (
              <Text center medium heavy style={{ color: "#fff" }}>
                SEND
              </Text>
            )}
          </SignInBtn>
          <HaveAccountContainer>
            <Text center style={{ marginTop: 30 }}>
              Already have an account?{" "}
            </Text>

            <SignInNav onPress={() => navigation.navigate("SignIn")}>
              <Text bold style={{ color: "#4a90e2" }}>
                Sign In
              </Text>
            </SignInNav>
          </HaveAccountContainer>
        </InputForm>
      </LoginPanel>
    </Container>
  );
};

export default GoogleSignInScreen;

const Loading = styled.ActivityIndicator.attrs((props) => ({
  color: "#ffffff",
  size: "small",
}))``;

const Container = styled.View`
  flex: 1;
`;

const HeadContainer = styled.View`
  height: 40%;
  background-color: #6eecfb;
`;

const HeaderTxt = styled(Text)`
  margin-top: 30px;
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

const HidePassword = styled.TouchableOpacity``;
const ForgotPasswordForm = styled.TouchableOpacity``;

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
  padding-top: 10px;
`;

const SignInBtn = styled.TouchableHighlight`
  padding: 10px;
  background-color: #68aaf7;
  border-radius: 20px;
  border-color: #fff;
  margin-top: 30px;
`;

const HaveAccountContainer = styled.View`
  justify-content: center;
  flex-direction: row;
  align-items: flex-end;
`;

const SignInNav = styled.TouchableOpacity``;
