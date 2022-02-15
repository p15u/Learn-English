import React, { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modalbox";
import Text from "../../Text";
import vocabApi from "../../../api/vocabApi";
import { AntDesign } from "@expo/vector-icons";
import { CheckBox } from "react-native-elements";

import { FirebaseContext } from "../../../context/FirebaseContext";

const RequestPublicModal = ({ forwardRef, vocabSet }) => {
  const deviceWidth = Dimensions.get("window").width;
  const [checked, setChecked] = useState(false);
  const firebase = useContext(FirebaseContext)


  const onPressRequest = async () => {
    await vocabApi.put({ public: 1 }, vocabSet.id);
    forwardRef.current.close();
  };

  const onPressClose = () => {
    forwardRef.current.close();
  };

  return (
    <Modal
      style={{
        justifyContent: "center",
        borderRadius: 10,
        shadowRadius: 10,
        width: deviceWidth - 50,
        height: vocabSet.public == 1 ? 250 : 350,
        zIndex: 90,
      }}
      position="center"
      backdrop={true}
      ref={forwardRef}
      backdropOpacity={0.8}
      swipeToClose={false}
      backdropPressToClose={false}
    >
      {vocabSet.public == 0 && (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 100,
          }}
          onPress={onPressClose}
        >
          <AntDesign name="closecircleo" color="red" size={20} />
        </TouchableOpacity>
      )}

      <View
        style={{
          backgroundColor: "#FFFFFF",
          height: vocabSet.public == 1 ? 250 : 350,
          padding: 20,
          borderRadius: 10,
          justifyContent: "flex-start",
        }}
      >
        <Text heavy large center>
          Request Public
        </Text>
        {vocabSet.public == 1 ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "space-around",
              height: "100%",
            }}
          >
            <Text center medium>
              You have already submitted a public request, please wait for us to
              moderate it!{" "}
            </Text>
            <TouchableHighlight
              style={{
                backgroundColor: "#aaaaaa",
                padding: 10,
                borderRadius: 10,
                marginLeft: 60,
                marginRight: 60,
                alignItems: "center",
              }}
              onPress={onPressClose}
              underlayColor="#919191"
            >
              <Text heavy medium style={{ color: "#FFFFFF" }}>
                Close
              </Text>
            </TouchableHighlight>
          </View>
        ) : (
          <View
            style={{
              justifyContent: "space-around",
              height: "100%",
              padding: 10,
            }}
          >
            <Text center>
              You will have to wait to be{" "}
              <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>
                accepted
              </Text>{" "}
              for{" "}
              <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>
                public
              </Text>{" "}
              this vocabulary set
            </Text>
            <Text center>
              Your post may be{" "}
              <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>
                rejected
              </Text>{" "}
              if it violates our standards
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text center>Read our policy </Text>
              <TouchableOpacity>
                <Text
                  style={{
                    fontStyle: "italic",
                    color: "blue",
                  }}
                >
                  here
                </Text>
              </TouchableOpacity>
            </View>
            <CheckBox
              title="I have read and made sure the vocabulary set meets the policy"
              checked={checked}
              onPress={() => setChecked(!checked)}
            />
            <TouchableHighlight
              style={{
                backgroundColor: checked === false ? "gray" : "#68aaf7",
                padding: 10,
                borderRadius: 10,
                marginLeft: 60,
                marginRight: 60,
                alignItems: "center",
              }}
              onPress={onPressRequest}
              underlayColor="#388FF4"
              disabled={checked == false}
            >
              <Text heavy medium style={{ color: "#FFFFFF" }}>
                Send Request
              </Text>
            </TouchableHighlight>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default RequestPublicModal;

const styles = StyleSheet.create({
  inputFieldContainer: {
    borderBottomColor: "black",
    borderBottomWidth: 2,
    flexDirection: "row",
    alignItems: "center",
  },

  inputField: {
    width: "94%",
  },
});
