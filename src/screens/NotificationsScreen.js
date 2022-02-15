import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Button,
  ScrollView,
  RefreshControl,
} from "react-native";
import Notification from "../components/Notifications";
import Header from "../components/Header";

import firebase from "firebase";
import "firebase/firestore";

import { UserContext } from "../context/UserContext";
import { useIsFocused } from "@react-navigation/core";

import LoadingModal from "../components/LoadingModal";

const deviceWidth = Dimensions.get("window").width;

const NotificationsScreen = () => {
  const isFocused = useIsFocused();
  const [isNotification, setIsNotification] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useContext(UserContext);

  useEffect(() => {
    const subscriber = firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .onSnapshot((documentSnapshot) => {
        let notis = documentSnapshot.data().notifications;
        notis.sort((a, b) => {
          return b.createAtInMills - a.createAtInMills;
        });
        setNotifications(notis);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  return (
    <View style={styles.container}>
      <Header isNotification={isNotification} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {notifications.map((noti) => (
          <Notification key={noti.id} notification={noti} isReaded={true} />
        ))}
      </ScrollView>
    </View>
  );
};
export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  notificationAlert: {
    position: "absolute",
    backgroundColor: "red",
    width: 20,
    height: 20,
    borderRadius: 100,
    alignItems: "center",
    bottom: -10,
    right: deviceWidth - 265,
  },
});
