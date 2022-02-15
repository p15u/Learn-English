import React, { useState, useContext, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  TouchableHighlight,
  TextInput,
} from "react-native";
import Header from "../../components/Header";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import Text from "../../components/Text";
import { UserContext } from "../../context/UserContext";
import { SwipeListView } from "react-native-swipe-list-view";
import vocabApi from "../../api/vocabApi";
import publicApi from "../../api/publicApi";
import EditVocabSetModal from "../../components/VocabSet/Modal/EditVocabSetModal";
import AddVocabModal from "../../components/VocabSet/Modal/AddVocabModal";
import VocabDetailsModal from "../../components/VocabSet/Modal/VocabDetailsModal";
import RequestPublicModal from "../../components/VocabSet/Modal/RequestPublicModal";
import Modal from "react-native-modalbox";

import LoadingModal from "../../components/LoadingModal";

const VocabSetDetails = ({ navigation, route }) => {
  const [isVocabDetails, setIsVocabDetails] = useState(true);

  const [vocabSet, setVocabSet] = useState({});
  const [vocabList, setVocabList] = useState([]);

  const [lengthOfVocabs, setLengthOfVocabs] = useState(0);
  const [isUpdateVocabSet, setIsUpdateVocabSet] = useState(0);
  const [isClickedEdit, setIsClickedEdit] = useState(false);

  const [isHome, setIsHome] = useState(false);

  const [getVocab, setVocab] = useState({});

  const [user, setUser] = useContext(UserContext);
  const openOptionView = useRef(null);
  const openEditModal = useRef(null);
  const openAddModal = useRef(null);
  const openDetailVocabModal = useRef(null);
  const openRequestPublicModal = useRef(null);

  const [loadingModal, setLoadingModal] = useState(false);

  useEffect(() => {
    const fetchVocabSetById = async () => {
      try {
        setLoadingModal(true);
        let response;
        if (route.params.home === true) {
          setIsHome(true);
          response = await publicApi.getAll({
            id: route.params.publicVocabSet.id,
          });
        } else {
          response = await vocabApi.get(route.params.id);
          setIsHome(false);
        }

        setVocabSet(response);
        setVocabList(response.vocabs);
        setLengthOfVocabs(response.vocabs.length);
      } catch (error) {
        console.log("Error @fetchVocabSetList4: ", error.message);
      }

      setLoadingModal(false);
    };

    fetchVocabSetById();
  }, [isUpdateVocabSet, route]);

  const CallBack = () => {
    openOptionView.current.open();
  };

  const handleOnPressDetailVocabSet = () => {
    setIsHome(false);
    navigation.reset({
      index: 0,
      routes: [{ name: isHome === true ? "Home" : "ManageVocabSetScreen" }],
    });
  };

  const ConfirmDelete = () => {
    Alert.alert(
      "Are you sure you want to delete this set of vocabulary?",
      "You cannot undo this action",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            onPressDelete();
          },
        },
      ]
    );
  };

  const onPressDelete = async () => {
    await vocabApi.delete(route.params.id);
    navigation.navigate("ManageVocabSetScreen");
  };

  const onPressOpenEdit = () => {
    openEditModal.current.open();
    openOptionView.current.close();
  };

  const onPressOpenAdd = () => {
    openAddModal.current.open();
    openOptionView.current.close();
  };

  const onPressOpenVocabDetails = (item, isEdit) => {
    openDetailVocabModal.current.open();
    setVocab(item);
    setIsClickedEdit(isEdit);
  };

  const onPressOpenRequesPublicModal = () => {
    openRequestPublicModal.current.open();
    openOptionView.current.close();
  };

  const OptionView = ({ item }) => {
    return (
      <Modal
        style={{
          borderRadius: 10,
          shadowRadius: 10,
          height: 260,
        }}
        position="bottom"
        backdrop={true}
        ref={openOptionView}
        backdropOpacity={0.8}
      >
        <View style={styles.optionViewContainer}>
          <AntDesign
            name="minus"
            size={70}
            color="gray"
            style={{ position: "absolute", top: -25, alignSelf: "center" }}
          />
          <View style={styles.optionItemsContainer}>
            <TouchableHighlight
              style={styles.itemStyles}
              onPress={onPressOpenEdit}
              underlayColor="#8B8B8B"
            >
              <View style={styles.itemContainer}>
                <AntDesign name="edit" size={22} color="black" />
                <Text style={styles.optionText}>Edit set's Information</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              style={styles.itemStyles}
              onPress={onPressOpenAdd}
              underlayColor="#8B8B8B"
            >
              <View style={styles.itemContainer}>
                <AntDesign name="addfile" size={22} color="black" />
                <Text style={styles.optionText}>Add vocabulary</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              style={styles.itemStyles}
              onPress={onPressOpenRequesPublicModal}
              underlayColor="#8B8B8B"
            >
              <View style={styles.itemContainer}>
                <AntDesign name="earth" size={22} color="black" />
                <Text style={styles.optionText}>Public</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              style={styles.itemStylesDelete}
              onPress={ConfirmDelete}
              underlayColor="#8B8B8B"
            >
              <View style={styles.itemContainer}>
                <AntDesign name="delete" size={22} color="#FF3333" />
                <Text style={{ color: "#FF3333", marginLeft: 10 }}>
                  Delete set
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    );
  };

  const VocabDetails = ({ item }) => {
    return (
      <TouchableHighlight
        style={{
          backgroundColor: "#4a90e2",
          borderRadius: 10,
          padding: 10,
          paddingLeft: 20,
          marginTop: 10,
          marginBottom: 10,
          height: 60,
        }}
        underlayColor="#388FF4"
        onPress={() => onPressOpenVocabDetails(item, false)}
      >
        <View>
          <Text heavy medium style={{ color: "#FFFFFF" }}>
            {item.term}
            {"    "}
            <Text style={{ fontStyle: "italic", color: "#FFFFFF" }}>
              {item.wordType}
            </Text>
          </Text>
          <Text style={{ color: "#FFFFFF" }}>{item.spelling}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  const deleteVocabByVocabId = async (idVocab) => {
    const newVocabs = vocabSet.vocabs.filter(
      (vocab) => vocab.idVocab !== idVocab
    );
    const newVocabSet = vocabSet;
    newVocabSet.vocabs = newVocabs;
    setVocabSet(newVocabSet);
    setVocabList(newVocabs);
    await vocabApi.put(newVocabSet, route.params.id);
    setLengthOfVocabs(lengthOfVocabs - 1);
  };

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
        onPress={() => onPressOpenVocabDetails(data.item, true)}
        disabled={isHome === true}
      >
        <AntDesign name="edit" size={22} color="#FFFFFF" />
        <Text heavy style={{ color: "#FFFFFF" }}>
          Edit
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => deleteVocabByVocabId(data.item.idVocab)}
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        disabled={isHome === true}
      >
        <AntDesign name="delete" size={22} color="#FFFFFF" />
        <Text heavy style={{ color: "#FFFFFF" }}>
          Delete
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {loadingModal && <LoadingModal />}
      <Header
        isVocabDetails={isVocabDetails}
        navigation={navigation}
        CallBack={CallBack}
        handleOnPressDetailVocabSet={handleOnPressDetailVocabSet}
        isHome={isHome}
      />
      <OptionView />
      <View style={styles.contentContainer}>
        <Text heavy title>
          {vocabSet.title}
        </Text>
        <Text>
          By{" "}
          <Text heavy style={{ fontStyle: "italic" }}>
            {isHome === true ? route.params.username : user.username}
          </Text>{" "}
          | {lengthOfVocabs} vocabularies
        </Text>
        <Text tiny style={{ fontStyle: "italic" }}>
          {vocabSet.createAt}
        </Text>
        <Text style={{ top: 5 }}>Description: "{vocabSet.description}"</Text>
        <View style={styles.btnContainer}>
          <TouchableHighlight
            style={styles.button}
            onPress={() => navigation.navigate("LearnVocabs", vocabSet)}
            underlayColor="#388FF4"
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
            onPress={() => navigation.navigate("TestVocabsScreen", vocabSet)}
            underlayColor="#388FF4"
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
        <Text heavy medium style={{ marginTop: 20 }}>
          Vocabularies:
        </Text>
        <SwipeListView
          data={vocabList}
          renderItem={VocabDetails}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-130}
          keyExtractor={(item) => item.idVocab}
        />
      </View>
      <VocabDetailsModal
        forwardRef={openDetailVocabModal}
        vocabList={vocabList}
        vocabs={getVocab}
        vocabSetID={vocabSet.id}
        isClickedEditModal={isClickedEdit}
        setIsUpdateVocabSet={setIsUpdateVocabSet}
        isHome={isHome}
      />
      <EditVocabSetModal
        forwardRef={openEditModal}
        vocabSet={vocabSet}
        setIsUpdateVocabSet={setIsUpdateVocabSet}
      />
      <AddVocabModal
        forwardRef={openAddModal}
        vocabSet={vocabSet}
        setIsUpdateVocabSet={setIsUpdateVocabSet}
      />
      <RequestPublicModal
        forwardRef={openRequestPublicModal}
        vocabSet={vocabSet}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    backgroundColor: "#68aaf7",
    padding: 10,
    width: "45%",
    alignItems: "center",
    borderRadius: 10,
  },
  contentContainer: {
    padding: 20,
    flex: 2,
  },

  optionViewContainer: {
    flex: 1,
  },

  optionItemsContainer: {
    height: "90%",
    justifyContent: "center",
  },

  itemContainer: {
    flexDirection: "row",
  },

  itemStyles: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    padding: 10,
  },

  itemStylesDelete: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "center",
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    padding: 10,
  },

  optionText: {
    marginLeft: 10,
  },

  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  rowBack: {
    flexDirection: "row",
  },

  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 10,
    width: 70,
    height: 60,
  },

  backRightBtnLeft: {
    backgroundColor: "blue",
    right: 70,
  },

  backRightBtnRight: {
    backgroundColor: "red",
    right: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default VocabSetDetails;
