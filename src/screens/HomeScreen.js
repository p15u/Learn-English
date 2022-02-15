import React, { useState, useEffect, useRef, useContext } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  TouchableHighlight,
} from "react-native";
import Header from "../components/Header";
import PublicVocabSet from "../components/VocabSet/PublicVocabSet";
import Text from "../components/Text";
import publicApi from "../api/publicApi";
import { FontAwesome } from "@expo/vector-icons";
import FilterModal from "../components/FilterModal";
import { FirebaseContext } from "../context/FirebaseContext";

import * as Notifications from "expo-notifications";

const deviceWidth = Dimensions.get("window").width;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const HomeScreen = ({ navigation }) => {
  const [publicPosts, setPublicPosts] = useState([]);
  const [filteredObjs, setFileredObjs] = useState([]);
  const [isHomePage, setIsHomePage] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const notificationListener = useRef();
  const responseListener = useRef();
  const openFilterModal = useRef(null);

  const firebase = useContext(FirebaseContext)

  useEffect(() => {
    const fetchVocabSetList = async () => {
      try {
        if (!refreshing) {
          const response = await publicApi.getAll();
          response.sort((a, b) => {
            return b.createAtInMills - a.createAtInMills;
          })
          setPublicPosts(response);
          setFileredObjs(response);
        }
      } catch (error) {
        console.log("Error @fetchVocabSetList2: ", error.message);
      }
    };
    fetchVocabSetList();

    registerForPushNotificationsAsync().then(async token => {
      await firebase.updateUser({ notiToken: token });
    }).catch(() => alert("Opps something occured !"));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => { });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        navigation.navigate("Notification");
      });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [refreshing]);


  // [Start] Register for push notification
  const registerForPushNotificationsAsync = async () => {

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert(`You won't receive a notification each time the morderation is complete.`);
      return;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;
    console.log(token);

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }
  // [End] Register for push notification

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const onFilter = (day, month, year) => {
    const convertDay = (day < 10 ? "0" : "") + day;

    let filtered = [];
    if (day.length == 0 && month == 0 && year.length == 0) {
      const getDate = new Date().getMonth() + 1;
      const getMonth = (getDate < 10 ? "0" : "") + getDate;
      filtered = publicPosts.filter(
        (item) => item.createAt.substring(0, 2) === getMonth && item
      );
    } else if (day.length != 0 && month == 0 && year.length == 0) {
      filtered = publicPosts.filter(
        (item) => item.createAt.substring(3, 5) === convertDay && item
      );
    } else if (day.length != 0 && month != 0 && year.length == 0) {
      const selectedDate = [month, convertDay].join("/");
      filtered = publicPosts.filter(
        (item) =>
          [item.createAt.substring(0, 2), item.createAt.substring(3, 5)].join(
            "/"
          ) === selectedDate && item
      );
    } else if (day.length != 0 && month != 0 && year.length != 0) {
      const selectedDate = [month, convertDay, year].join("/");
      filtered = publicPosts.filter(
        (item) => item.createAt === selectedDate && item
      );
    } else if (day.length != 0 && month == 0 && year.length != 0) {
      const selectedDate = [convertDay, year].join("/");
      filtered = publicPosts.filter(
        (item) =>
          [item.createAt.substring(3, 5), item.createAt.substring(6, 10)].join(
            "/"
          ) === selectedDate && item
      );
    } else if (day.length == 0 && month != 0 && year.length != 0) {
      const selectedDate = [month, year].join("/");
      filtered = publicPosts.filter(
        (item) =>
          [item.createAt.substring(0, 2), item.createAt.substring(6, 10)].join(
            "/"
          ) === selectedDate && item
      );
    } else if (day.length == 0 && month == 0 && year.length != 0) {
      filtered = publicPosts.filter(
        (item) => item.createAt.substring(6, 10) == year && item
      );
    } else if (day.length == 0 && month != 0 && year.length == 0) {
      filtered = publicPosts.filter(
        (item) => item.createAt.substring(0, 2) === month && item
      );
    }

    setFileredObjs(filtered);
  };

  const RenderedItem = ({ item, index }) => {
    return (
      <PublicVocabSet
        key={item.id}
        publicVocabSet={item}
        navigation={navigation}
        indexVocab={index}
      />
    );
  };

  const onPressFilter = () => {
    openFilterModal.current.open();
  };

  const onPressSearch = () => {
    let search = [];
    if (searchInput == "") {
      setFileredObjs(publicPosts);
    } else {
      search = filteredObjs.filter(
        (item) =>
          item.title.toLowerCase().includes(searchInput.toLowerCase()) ==
          true && item
      );
      setFileredObjs(search);
    }
  };

  return (
    <View style={styles.container}>
      <Header isHomePage={isHomePage} />
      <SafeAreaView style={{ flex: 2 }}>
        <FlatList
          data={filteredObjs}
          renderItem={RenderedItem}
          ListHeaderComponent={
            <View style={styles.topTitle}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "black",
                  width: "90%",
                  borderRadius: 10,
                  paddingLeft: 10,
                  flexDirection: "row",
                }}
              >
                <TextInput
                  style={{ width: "80%" }}
                  placeholder="Search by title"
                  onChangeText={(text) => setSearchInput(text)}
                />
                <TouchableHighlight
                  style={{
                    backgroundColor: "#68aaf7",
                    width: "20.2%",
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    borderColor: "black",
                    borderLeftWidth: 0,
                    height: 30,
                    borderRightWidth: 1,
                    Left: 10,
                  }}
                  underlayColor="#388FF4"
                  onPress={onPressSearch}
                >
                  <FontAwesome name="search" size={20} color="#FFFFFF" />
                </TouchableHighlight>
              </View>
              <TouchableOpacity
                style={{ alignItems: "center" }}
                onPress={onPressFilter}
              >
                <FontAwesome name="filter" color="black" size={22} />
                <Text tiny>filter</Text>
              </TouchableOpacity>
            </View>
          }
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ alignItems: "center" }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => (
            <View style={{ alignItems: "center", marginTop: 200 }}>
              <FontAwesome name="folder-open-o" size={90} color="gray" />
              <Text heavy title style={{ color: "gray" }}>
                Empty Data!
              </Text>
            </View>
          )}
        />
      </SafeAreaView>
      <FilterModal forwardRef={openFilterModal} onFilter={onFilter} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dfe0df",
  },

  topTitle: {
    width: deviceWidth - 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginTop: 10,
    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 20,
    paddingLeft: 20,
  },

  scrollView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
