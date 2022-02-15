import React, { useState, useEffect } from "react";
import FlipCard from "react-native-flip-card";
import {
  StyleSheet,
  View,
  Animated,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import Text from "../Text";

const LearningSlide = (props) => {
  const [levelPanel, setLevelPanel] = useState(false);
  const [vocab, setVocab] = useState(props.vocab);

  const startValue = new Animated.Value(1);
  const endValue = 0;
  const duration = 2000;

  useEffect(() => {
    Animated.timing(startValue, {
      toValue: endValue,
      duration: duration,
      useNativeDriver: true,
    }).start();
  }, [startValue, endValue, duration]);

  return (
    <View style={styles.slide}>
      <View style={styles.flipCart}>
        <FlipCard
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 10,
          }}
          friction={1000}
          perspective={1000}
          flipVertical={true}
          flip={false}
          clickable={true}
          onFlipStart={() => setLevelPanel(!levelPanel)}
        >
          {/* Face Side */}
          <View style={styles.flipCartFront}>
            <Text heavy title>
              {vocab.term}
            </Text>
            <Animated.View
              style={{
                opacity: startValue,
                top: 100,
              }}
            >
              <Text medium style={{ color: "#388FF4", fontStyle: "italic" }}>
                Tap on card to flip
              </Text>
            </Animated.View>
          </View>
          {/* Back Side */}
          <View style={styles.flipCartBack}>
            <Text heavy>{vocab.wordType}</Text>
            <Text>{vocab.spelling}</Text>
            {/* <SafeAreaView
              style={{ height: 70, alignSelf: "center", marginBottom: 10 }}
            > */}
            <ScrollView style={{ marginBottom: 10 }}>
              <Text medium semi>
                {vocab.define}
              </Text>
            </ScrollView>
            {/* </SafeAreaView> */}

            <Image
              style={{
                width: 270,
                height: 200,
                alignSelf: "center",
                borderRadius: 10,
              }}
              source={
                vocab.image === ""
                  ? require("../../../assets/image/no_img.png")
                  : { uri: vocab.image }
              }
            />
          </View>
        </FlipCard>
      </View>
      {/* {levelPanel && (
        <View style={styles.difficultLevelContainer}>
          <TouchableOpacity style={styles.difficultBtn}>
            <Text center semi color="#FFFFFF">
              Again
            </Text>
            <Text center tiny color="#FFFFFF">
              1m
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.difficultBtn}>
            <Text center semi color="#FFFFFF">
              Hard
            </Text>
            <Text center tiny color="#FFFFFF">
              1d
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.difficultBtn}>
            <Text center semi color="#FFFFFF">
              Good
            </Text>
            <Text center tiny color="#FFFFFF">
              2d
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.difficultBtn}>
            <Text center semi color="#FFFFFF">
              Easy
            </Text>
            <Text center tiny color="#FFFFFF">
              3d
            </Text>
          </TouchableOpacity>
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  flipCart: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },

  flipCartFront: {
    height: 350,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#888888",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,

    elevation: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  flipCartBack: {
    height: 350,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#888888",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,

    elevation: 20,
  },

  difficultLevelContainer: {
    flexDirection: "row",
    marginTop: 50,
    width: 300,
    justifyContent: "space-between",
  },

  difficultBtn: {
    backgroundColor: "#68aaf7",
    padding: 10,
    borderRadius: 10,
  },

  wrapper: {},
  slide: {
    flex: 1,
    paddingTop: 100,
    alignItems: "center",
  },
});

export default LearningSlide;
