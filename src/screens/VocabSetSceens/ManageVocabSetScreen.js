import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { AntDesign } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import { useIsFocused } from "@react-navigation/native";

import vocabApi from "../../api/vocabApi";

import Text from "../../components/Text";
import Header from "../../components/Header";
import VocabSet from "../../components/VocabSet/VocabSet";

const ManageVocabSetScreen = ({ navigation }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Favourite", value: "Favourite" },
    { label: "Newest", value: "Newest" },
  ]);

  const [isVocabManagement, setIsVocabManagement] = useState(true);
  const [optionDropdown, setOptionDropdown] = useState("");
  const [searchText, setSearchText] = useState("");

  const isFocused = useIsFocused();

  return (
    <Container>
      <Header isVocabManagement={isVocabManagement} />
      <SearchInputContainer>
        <AntDesign
          name="search1"
          size={20}
          color="gray"
          style={{ width: "10%" }}
        />
        <SearchInput
          placeholder="Search by title"
          onChangeText={(text) => setSearchText(text)}
        />
        {/* <SearchBtn underlayColor="#388FF4" onPress={onPressSearch}>
          <Text style={{ color: "#FFFFFF" }}>
            <AntDesign
              name="search1"
              size={20}
              color="#FFFFFF"
              style={{ width: "10%" }}
            />
          </Text>
        </SearchBtn> */}
      </SearchInputContainer>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Sort by..."
        containerStyle={{ width: "37%" }}
        textStyle={{
          fontSize: 16,
        }}
        containerStyle={{
          position: "relative",
          top: 25,
          width: "37%",
        }}
        onChangeValue={setOptionDropdown}
      />
      <CreateNewBtn
        underlayColor="#388FF4"
        onPress={() => navigation.navigate("CreateVocabScreen")}
      >
        <Text medium style={{ color: "#ffffff" }}>
          Create <AntDesign name="plus" size={16} color="#ffffff" />
        </Text>
      </CreateNewBtn>

      <Text large heavy style={{ marginTop: 30 }}>
        Vocabulary sets:
      </Text>
      <VocabSet
        search={searchText}
        dropdown={optionDropdown}
        isFocused={isFocused}
        navigation={navigation}
      />
    </Container>
  );
};

const Container = styled.View`
  padding: 20px;
  flex: 1;
`;

const SearchInputContainer = styled.View`
  padding-left: 10px;
  border: black 1px;
  width: 60%;
  height: 40px;
  flex-direction: row;
  align-items: center;
  border-radius: 10px;
  position: absolute;
  right: 20px;
  top: 45px;
`;

const CreateNewBtn = styled.TouchableHighlight`
  padding: 15px;
  background-color: #68aaf7;
  border-radius: 10px;
  align-self: flex-end;
  position: relative;
  top: -25px;
`;

const SearchInput = styled.TextInput`
  width: 90%;
  padding-left: 10px;
`;

const SearchBtn = styled.TouchableHighlight`
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

export default ManageVocabSetScreen;
