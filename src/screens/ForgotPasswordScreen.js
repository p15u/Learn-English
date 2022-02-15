import React, { useState, useContext } from "react";
import styled from "styled-components";

import { FirebaseContext } from "../context/FirebaseContext";

import Text from "../components/Text";

const ForgotPasswordScreen = ({ navigation }) => {
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [emptyEmail, setEmptyEmail] = useState(false);
  const [email, setEnteredEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const firebase = useContext(FirebaseContext);

  const resetPassword = async () => {
    const req = await firebase.resetPassword(email);
    if (req == false && email != "") {
      setInvalidEmail(true);
      setEmptyEmail(false);
    } else if (email == "") {
      setEmptyEmail(true);
      setInvalidEmail(false);
    } else {
      setLoading(true);
      setEmptyEmail(false);
      setInvalidEmail(false);
      navigation.navigate("SignIn");
      setLoading(true);
      alert("We have sent link to reset password to your email.");
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
          RESET PASSWORD
        </HeaderTxt>

        <InputForm>
          <Text center small style={{ marginBottom: 20 }}>
            Enter your email address and we will send you a link to change your
            password
          </Text>
          <InputFieldContainer>
            <Text heavy>Email</Text>
            <InputField
              placeholder="Enter email"
              onChangeText={(email) => setEnteredEmail(email)}
              value={email}
            />
          </InputFieldContainer>
          {invalidEmail == true && (
            <Text color="red">
              Email does not exist or has not been used to register
            </Text>
          )}
          {emptyEmail && <Text color="red">Email cannot be empty</Text>}

          <SignInBtn
            underlayColor="#388FF4"
            onPress={resetPassword}
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

export default ForgotPasswordScreen;

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

const InputForm = styled.View`
  padding: 20px;
`;

const InputFieldContainer = styled.View``;

const InputField = styled.TextInput`
  border-bottom-color: black;
  border-bottom-width: 1px;
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
