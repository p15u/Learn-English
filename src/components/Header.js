import React, { useState } from "react";
import styled from "styled-components";
import { AntDesign } from "@expo/vector-icons";
import { SwipeListView } from "react-native-swipe-list-view";

import Text from "./Text";

const Header = (props) => {
  return (
    <HeaderContainer>
      {props.isCreateVocab === true ? (
        <CreateVocabHeader>
          <BackButton onPress={props.navigation.goBack}>
            <AntDesign name="left" size={24} color="gray" />
          </BackButton>
          <Text heavy large>
            Create Set
          </Text>
          <AddNewVocabButton onPress={props.handleCreateVocabSet}>
            <Text semi medium color="#FFFFFF">
              Create
            </Text>
          </AddNewVocabButton>
        </CreateVocabHeader>
      ) : props.isVocabManagement === true ? (
        <VocabManagementHeader>
          <Text heavy large>
            Management
          </Text>
        </VocabManagementHeader>
      ) : props.isDetailProfile === true ? (
        <ProfileDetailHeader>
          <BackButton onPress={props.navigation.goBack}>
            <AntDesign name="left" size={24} color="gray" />
          </BackButton>
          <Text heavy large style={{ left: 20 }}>
            Change{" "}
            {props.isEmail === true
              ? "Email"
              : props.isUsername === true
              ? "Username"
              : props.isPassword === true
              ? "Password"
              : ""}
          </Text>
        </ProfileDetailHeader>
      ) : props.isHomePage === true ? (
        <HomePageHeaderContainer>
          <Text large heavy center style={{ width: "100%" }}>
            Home Page
          </Text>
        </HomePageHeaderContainer>
      ) : props.isVocabDetails ? (
        <VocabDetailsHeader>
          <BackButton onPress={props.handleOnPressDetailVocabSet}>
            <AntDesign name="left" size={24} color="gray" />
          </BackButton>
          <Text
            large
            heavy
            style={{
              position: "absolute",
              right: 90,
              top: 47,
            }}
          >
            Vocabulary Set Details
          </Text>
          {props.isHome === false && (
            <OptionBtn onPress={props.CallBack}>
              <AntDesign name="ellipsis1" size={28} color="black" />
            </OptionBtn>
          )}
        </VocabDetailsHeader>
      ) : props.isLearnVocabs ? (
        <LearnAndTestHeader>
          <BackButton
            onPress={props.handleOnPressBackLearnVocabs}
            style={{ paddingTop: 5 }}
          >
            <AntDesign name="left" size={24} color="gray" />
          </BackButton>
          <View
            style={{
              width: "60%",
              flexDirection: "row",
            }}
          >
            <Text title heavy>
              Learn
            </Text>
          </View>
        </LearnAndTestHeader>
      ) : props.isTestVocab ? (
        <LearnAndTestHeader>
          <BackButton onPress={props.handleOnPressBackTestVocabs}>
            <AntDesign name="left" size={24} color="gray" />
          </BackButton>
          <View
            style={{
              width: "60%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text large heavy>
              Test
            </Text>
            <FinishTestBtn onPress={props.finishTest}>
              <Text heavy style={{ color: "#FFFFFF" }}>
                Finish Test
              </Text>
            </FinishTestBtn>
          </View>
        </LearnAndTestHeader>
      ) : props.isNotification ? (
        <NotificationHeaderContainer>
          <Text large heavy center style={{ width: "100%" }}>
            Notifications
          </Text>
        </NotificationHeaderContainer>
      ) : (
        <HeaderContainer />
      )}
    </HeaderContainer>
  );
};

export default Header;

const BackButton = styled.TouchableOpacity``;
const OptionBtn = styled.TouchableOpacity``;

const UpgradeBtn = styled.TouchableOpacity`
  background-color: #68aaf7;
  padding: 10px;
  border-radius: 10px;
  position: absolute;
  right: 0;
  top: -20px;
`;

const FinishTestBtn = styled.TouchableOpacity`
  background-color: #68aaf7;
  justify-content: center;
  padding: 10px;
  border-radius: 10px;
`;

const HeaderContainer = styled.View``;
const View = styled.View``;

const CreateVocabHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 50px 20px 0px 20px;
  align-items: center;
  margin-bottom: 10px;
`;

const ProfileDetailHeader = styled.View`
  flex-direction: row;
  padding: 50px 20px 0px 20px;
  margin-bottom: 10px;
  align-items: center;
`;

const VocabDetailsHeader = styled.View`
  flex-direction: row;
  padding: 50px 20px 0px 20px;
  margin-bottom: 10px;
  align-items: center;
  justify-content: space-between;
`;

const LearnAndTestHeader = styled.View`
  flex-direction: row;
  padding: 50px 20px 10px 20px;
  margin-bottom: 10px;
  align-items: center;
  justify-content: space-between;
`;

const VocabManagementHeader = styled.View`
  align-items: center;
  padding: 30px 0px 0px 0px;
  flex-direction: row;
  justify-content: space-between;
`;

const SearchInputContainer = styled.View`
  padding-left: 10px;
  border: black 1px;
  width: 60%;
  height: 40px;
  flex-direction: row;
  align-items: center;
  border-radius: 10px;
`;

const HomePageHeaderContainer = styled.View`
  padding: 50px 10px 10px 10px;
  flex-direction: row;
  align-items: center;
  width: 100%;
  background-color: #ffffff;
`;

const NotificationHeaderContainer = styled.View`
  padding: 50px 10px 20px 10px;
  flex-direction: row;
  align-items: center;
  width: 100%;
  border-bottom-width: 1px;
  border-bottom-color: #999c99;
`;

const SearchInput = styled.TextInput`
  width: 80%;
`;

const SearchBtn = styled.TouchableOpacity`
  width: 20%;
  height: 40px;
  background-color: #68aaf7;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  justify-content: center;
  align-items: center;
  border-color: black;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-right-width: 1px;
  margin-left: 1px;
`;

const AddNewVocabButton = styled.TouchableOpacity`
  background-color: #4a90e2;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  width: 70px;
  padding: 10px;
`;
