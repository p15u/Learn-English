import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";

import { UserContext } from "../../context/UserContext";

import Carousel from "react-native-snap-carousel";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import Text from "../Text";
import vocabApi from "../../api/vocabApi";

const VocabSet = (props) => {
  const [carouselItems, setCarouselItems] = useState([]);
  const [user, setUser] = useContext(UserContext);

  useEffect(() => {
    const fetchVocabSetList = async () => {
      try {
        const response = await vocabApi.getAll({
          uid: user.uid,
          sortby: props.dropdown,
          title: props.search,
        });

        setCarouselItems(response);
      } catch (error) {
        console.log("Error @fetchVocabSetList1: ", error.message);
      }
    };

    fetchVocabSetList();
  }, [props.isFocused, props.dropdown, props.search]);

  const onPressItem = (index) => {
    props.navigation.navigate("VocabSetDetails", carouselItems[index]);
  };

  const renderItem = ({ item, index }) => {
    const numberOfVocabs = item.vocabs.length;
    return (
      <TouchableHighlight
        underlayColor="#388FF4"
        style={{
          backgroundColor: "#68aaf7",
          borderRadius: 10,
          height: 200,
          padding: 10,
          paddingLeft: 20,
          overflow: "hidden",
        }}
        onPress={() => onPressItem(index)}
      >
        <View style={{ height: 180 }}>
          <TouchableOpacity
            onPress={() => onPressFavourite(index)}
            style={{ alignItems: "flex-end" }}
          >
            <AntDesign
              name="star"
              size={28}
              color={item.isFavourite ? "orange" : "#FFFFFF"}
            />
          </TouchableOpacity>
          <View style={{ marginTop: 10, overflow: "hidden", height: 110 }}>
            <Text
              style={{ fontSize: 30, color: "#FFFFFF", fontWeight: "bold" }}
            >
              {item.title}
            </Text>
            <Text style={{ color: "#FFFFFF" }}>Terms: {numberOfVocabs}</Text>
            <Text
              style={{
                color: "#FFFFFF",
                fontStyle: "italic",
              }}
            >
              Description: {item.description}
            </Text>
          </View>
          <Text
            style={{
              color: "#FFFFFF",
              position: "absolute",
              right: 0,
              bottom: 0,
              fontStyle: "italic",
            }}
          >
            {item.createAt}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };

  const handleOnSnapVocabSet = (index) => { };

  const onPressFavourite = async (index) => {
    const currentVocabSet = carouselItems[index];
    currentVocabSet.isFavourite = !currentVocabSet.isFavourite;

    await vocabApi.put(currentVocabSet, currentVocabSet.id);

    const newCarouselItems = carouselItems.map((item) =>
      item.id === currentVocabSet.id ? currentVocabSet : item
    );
    setCarouselItems(newCarouselItems);
  };

  return (
    <SafeAreaView>
      <View style={{ marginTop: 20 }}>
        <Carousel
          layout={"default"}
          data={carouselItems}
          sliderWidth={390}
          itemWidth={200}
          renderItem={renderItem}
          onSnapToItem={handleOnSnapVocabSet}
          extraData={carouselItems}
          ListEmptyComponent={
            <View
              style={{
                alignItems: "center",
                marginTop: 40,
                marginLeft: -75,
                width: "90%",
              }}
            >
              <FontAwesome name="folder-open-o" size={100} color={"gray"} />
              <Text center heavy style={{ color: "gray" }}>
                You don't have any vocabulary set, press [Create +] button to
                create !
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default VocabSet;
