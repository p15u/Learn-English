import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Animated, Alert } from "react-native";
import Header from "../../components/Header";
import Text from "../../components/Text";
import TestSlider from "../../components/VocabSet/TestSlider";

import { AntDesign } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import TestResultModal from "../../components/VocabSet/Modal/TestResultModal";

const TestVocabsScreen = ({ navigation, route }) => {
  const [isTestVocab, setIsTestVocab] = useState(true);
  const [isFinish, setIsFinish] = useState(false);
  const [score, setScore] = useState(0);
  const [answerList, setAnswerList] = useState([]);

  const resultModal = useRef(null);

  const isFocused = useIsFocused();

  const initialOpacity = new Animated.Value(1);
  const initialMove = new Animated.Value(0);
  const endOpacity = 0;
  const endMove = -80;
  const duration = 2500;

  const [isHome, setIsHome] = useState(route.params.home);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(initialMove, {
        toValue: endMove,
        duration: duration,
        useNativeDriver: true,
      }),
      Animated.timing(initialOpacity, {
        toValue: endOpacity,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [initialMove, endMove, initialOpacity, endOpacity, duration]);

  const handleOnPressBackTestVocabs = () => {
    setIsHome(false);
    navigation.reset({
      index: 0,
      routes: [
        {
          name: isHome === true ? "Home" : "VocabSetDetails",
          params: route.params,
        },
      ],
    });
  };

  const handleFinishTest = () => {
    let empty = false;
    let countEmpty =
      isHome === true && answerList.length == 0
        ? route.params.publicVocabSet.vocabs.length
        : answerList.length != 0
        ? 0
        : route.params.vocabs.length;
    console.log(countEmpty);

    answerList.map((item) => {
      item == "" && (empty = true);
      item == "" && (countEmpty += 1);
    });

    if (empty == true || answerList.length == 0) {
      Alert.alert(
        "There " +
          (countEmpty > 1 ? "are " : " is ") +
          countEmpty +
          " unanswered question",
        "Do you want to ignore and continue to finish test?",
        [
          {
            text: "OK",
            onPress: () => {
              resultModal.current.open();
              setIsFinish(true);
            },
          },
          { text: "Cancel", style: "cancel" },
        ]
      );
    } else {
      resultModal.current.open();
      setIsFinish(true);
    }
  };

  const getScore = (score) => {
    setScore(score);
  };

  return (
    <View style={styles.containter}>
      <TestResultModal
        forwardRef={resultModal}
        score={score}
        navigation={navigation}
        vocabSets={route.params}
      />
      <Header
        navigation={navigation}
        isTestVocab={isTestVocab}
        finishTest={handleFinishTest}
        handleOnPressBackTestVocabs={handleOnPressBackTestVocabs}
      />
      <View style={styles.titleContainer}>
        <Text title heavy>
          {isHome === true
            ? route.params.publicVocabSet.title
            : route.params.title}
        </Text>
        <Text medium>
          {isHome === true
            ? route.params.publicVocabSet.vocabs.length
            : route.params.vocabs.length}{" "}
          Question(s)
        </Text>
      </View>
      <TestSlider
        isFinish={isFinish}
        isFocused={isFocused}
        vocabs={
          isHome === true
            ? route.params.publicVocabSet.vocabs
            : route.params.vocabs
        }
        getScore={getScore}
        setAnswerList={setAnswerList}
      />
      <Animated.View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          width: "90%",
          bottom: 70,
          transform: [{ translateX: initialMove }],
          opacity: initialOpacity,
        }}
      >
        <AntDesign name="caretleft" size={22} color="#388FF4" />
        <Text medium style={{ color: "#388FF4", fontStyle: "italic" }}>
          Swipe left to change question
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  containter: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
  },
});

export default TestVocabsScreen;
