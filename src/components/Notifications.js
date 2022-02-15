import React, { useState } from "react";
import { Image, StyleSheet, TouchableHighlight, View } from "react-native";
import Text from "../components/Text";

const Notification = ({ isReaded, notification }) => {
  const [isRead, setIsRead] = useState(isReaded);

  const calDateTime = (mills) => {
    const time = Date.now();
    const left = time - mills;

    const minute = left / 1000 / 60;
    if (minute < 60) return `${Math.floor(minute)} minutes ago`;

    const hour = minute / 60;
    if (hour < 24) return `${Math.floor(hour)} hours ago`;

    const days = hour / 24;
    return `${Math.floor(days)} days ago`;
  };

  const onPressNotification = () => {};
  return (
    <View>
      <TouchableHighlight
        style={{
          backgroundColor: isRead === false ? "#b2b5b2" : "#FFFFFF",
          padding: 10,
          borderBottomColor: "#999C99",
          borderBottomWidth: 1,
        }}
        onPress={onPressNotification}
        underlayColor={isRead === false ? "#999C99" : "#E6E6E6"}
      >
        <View style={styles.textContainer}>
          <Text
            heavy
            medium
            style={{
              color: notification.title === "Accepted" ? "green" : "#FF4136",
              paddingLeft: 10,
            }}
          >
            {notification.title}
          </Text>
          <Text
            style={{
              color: isRead === false ? "#FFFFFF" : "black",
              paddingLeft: 10,
            }}
          >
            {notification.body}
          </Text>
          <Text
            right
            style={{
              color: isRead === false ? "#FFFFFF" : "black",
            }}
          >
            {calDateTime(`${notification.createAtInMills}`)}
          </Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  avatarImg: {
    width: 60,
    height: 60,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "black",
  },
  textContainer: {
    justifyContent: "center",
  },
});
