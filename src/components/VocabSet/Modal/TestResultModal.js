import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  TouchableHighlight,
} from "react-native";
import Modal from "react-native-modalbox";
import Text from "../../Text";
import Fireworks from "../../Fireworks";
import { AntDesign } from "@expo/vector-icons";

const TestResultModal = ({
  forwardRef,
  isFireworks,
  score,
  navigation,
  vocabSets,
}) => {
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight = Dimensions.get("window").width;

  const [fireWork, setFireWork] = useState(true);

  const onClickClose = () => {
    forwardRef.current.close();
    navigation.navigate("VocabSetDetails", vocabSets);
  };

  return (
    <Modal
      style={{
        borderRadius: 10,
        shadowRadius: 10,
        width: deviceWidth - 50,
        height: 500,
      }}
      position="center"
      backdrop={true}
      ref={forwardRef}
      backdropOpacity={0.8}
      swipeToClose={false}
    >
      {/* {fireWork === true ? (
        <Fireworks
          speed={1}
          density={8}
          colors={["#ff0", "#ff3", "#cc0", "#ff4500", "#ff6347"]}
          height={deviceHeight}
          width={deviceWidth}
          zIndex={1}
        />
      ) : (
        <View></View>
      )} */}
      {score >= 50 && score <= 69 ? (
        <View style={styles.container}>
          {/* <Fireworks
            speed={1}
            density={8}
            colors={["#ff0", "#ff3", "#cc0", "#ff4500", "#ff6347"]}
            height={deviceHeight}
            width={deviceWidth}
            zIndex={1}
          /> */}
          <Image
            style={styles.imageStyle}
            source={require("../../../../assets/image/congrats.png")}
          />
          <Text title heavy>
            Your Score: {Math.round(score)}%
          </Text>
          <Text large style={{ textAlign: "center" }}>
            Well done! try harder next time!
          </Text>
          <TouchableHighlight
            style={styles.closeBtn}
            onPress={onClickClose}
            underlayColor="#388FF4"
          >
            <Text heavy style={{ color: "#FFFFFF" }}>
              CLOSE
            </Text>
          </TouchableHighlight>
        </View>
      ) : score >= 70 ? (
        <View style={styles.container}>
          {/* <Fireworks
            speed={1}
            density={8}
            colors={["#ff0", "#ff3", "#cc0", "#ff4500", "#ff6347"]}
            height={deviceHeight}
            width={deviceWidth}
            zIndex={1}
          /> */}
          <Image
            style={styles.excellentImg}
            source={require("../../../../assets/image/excellent.png")}
          />
          <Text title heavy>
            Your Score: {Math.round(score)}%
          </Text>
          <Text large style={{ textAlign: "center" }}>
            Excellent! Keep it up!
          </Text>
          <TouchableHighlight
            style={styles.closeBtn}
            onPress={onClickClose}
            underlayColor="#388FF4"
          >
            <Text heavy style={{ color: "#FFFFFF" }}>
              CLOSE
            </Text>
          </TouchableHighlight>
        </View>
      ) : (
        <View style={styles.container}>
          <AntDesign
            name="frowno"
            size={150}
            color="black"
            style={{ fontWeight: "bold" }}
          />
          <Text title heavy>
            Your Score: {Math.round(score)}%
          </Text>
          <Text large style={{ textAlign: "center" }}>
            Not good, you need to learn more and try again next time
          </Text>
          <TouchableHighlight
            style={styles.closeBtn}
            onPress={onClickClose}
            underlayColor="#388FF4"
          >
            <Text heavy style={{ color: "#FFFFFF" }}>
              CLOSE
            </Text>
          </TouchableHighlight>
        </View>
      )}
    </Modal>
  );
};

export default TestResultModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    justifyContent: "space-around",
  },
  imageStyle: {
    width: "75%",
    height: "45%",
    resizeMode: "stretch",
  },
  excellentImg: {
    width: "100%",
    height: "35%",
    resizeMode: "stretch",
  },
  closeBtn: {
    borderRadius: 10,
    backgroundColor: "#68aaf7",
    padding: 10,
  },
});
