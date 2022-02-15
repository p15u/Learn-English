import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Animated } from "react-native";
import Header from "../../components/Header";
import Swiper from "react-native-swiper";

import LearningSlide from "../../components/VocabSet/LearningSlide";

import Text from "../../components/Text";

const LearnVocabs = ({ navigation, route }) => {
  const [isLearnVocabs, setIsLearnVocab] = useState(true);
  const [isHome, setIsHome] = useState(route.params.home);

  const handleOnPressBackLearnVocabs = () => {
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

  return (
    <View style={styles.container}>
      <Header
        isLearnVocabs={isLearnVocabs}
        navigation={navigation}
        handleOnPressBackLearnVocabs={handleOnPressBackLearnVocabs}
        title={
          isHome === true
            ? route.params.publicVocabSet.title
            : route.params.title
        }
      />
      <View>
        {/* <Text title>
          {" "}
          {isHome === true
            ? route.params.publicVocabSet.title
            : route.params.title}
        </Text> */}
      </View>
      <Swiper style={styles.swiper}>
        {isHome === true
          ? route.params.publicVocabSet.vocabs.map((item) => {
              return (
                <LearningSlide
                  key={route.params.publicVocabSet.id}
                  vocab={item}
                />
              );
            })
          : route.params.vocabs.map((item) => {
              return <LearningSlide key={route.params.id} vocab={item} />;
            })}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9DD6EB",
  },
  swiper: {},
});

export default LearnVocabs;
