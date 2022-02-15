import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

const LoadingModal = () => {
  const [spinner, setSpinner] = useState(true);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setSpinner(false);
  //   }, 2000);
  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <View style={styles.container}>
      <Spinner
        visible={spinner}
        textContent={"Loading..."}
        textStyle={styles.spinnerTextStyle}
      />
    </View>
  );
};

export default LoadingModal;

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: "#FFF",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    position: "absolute",
  },
});
