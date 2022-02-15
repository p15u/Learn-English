import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import Text from "../Text";

const TestSlider = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselItems, setCarouselItems] = useState([]);
  const [answerList, setAnswerList] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    try {
      if (props.isFinish) {
        let per = 100 / props.vocabs.length;
        let score = 0;
        props.vocabs.forEach((vocab, index) => {
          if (vocab.term.toLowerCase() === answerList[index]) score += per;
        });

        props.getScore(score);
      } else {
        setCarouselItems(props.vocabs);
        var initAnswerList = [];
        props.vocabs.forEach(() => {
          initAnswerList.push("");
        });
        setAnswerList(initAnswerList);
      }
    } catch (error) {
      console.log("Error @TestVocab: ", error.message);
    }
  }, [props.isFinish]);

  const saveAsnwer = (value, index) => {
    let newAnswerList = answerList;
    newAnswerList[index] = value.toLowerCase();
    setAnswerList(newAnswerList);
    props.setAnswerList(answerList);
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.container} key={item.idVocab}>
        <View style={styles.questionContainer}>
          <Text>{item.wordType}</Text>

          <SafeAreaView style={{ height: 150, padding: 10 }}>
            <ScrollView>
              <Text large heavy>
                {item.define}
              </Text>
            </ScrollView>
          </SafeAreaView>

          <Image
            style={{ width: 270, height: 210, borderRadius: 10 }}
            source={
              item.image === ""
                ? require("../../../assets/image/no_img.png")
                : {
                    uri: item.image,
                  }
            }
          />
        </View>

        <View style={styles.inputFieldContainer}>
          <Text>Your answer:</Text>
          <TextInput
            onChangeText={(value) => saveAsnwer(value, index)}
            style={styles.inputField}
          />
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 30,
      }}
    >
      <Carousel
        layout={"tinder"}
        data={carouselItems}
        sliderWidth={400}
        itemWidth={300}
        renderItem={renderItem}
        onSnapToItem={(index) => setActiveIndex(index)}
        extraData={carouselItems}
        keyExtractor={(item) => item.idVocab}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    height: 450,
    padding: 10,
    shadowColor: "#888888",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,

    elevation: 20,
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  questionContainer: {
    alignItems: "center",
    height: 150,
  },
  inputFieldContainer: {
    alignItems: "flex-end",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  inputField: {
    borderBottomColor: "black",
    borderBottomWidth: 2,
    height: 30,
    color: "black",
    width: "60%",
  },
});

export default TestSlider;
