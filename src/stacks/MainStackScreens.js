import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { View, Dimensions, Text } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import VocabSetStackScreen from "../stacks/VocabSetStackScreen";
import ProfileStackScreen from "../stacks/ProfileStackScreen";
import NotificationsScreen from "../screens/NotificationsScreen";

export default MainStackScreens = () => {
  const MainStack = createBottomTabNavigator();
  const deviceWidth = Dimensions.get("window").width;
  const [isRead, setIsRead] = useState(false);

  const tabBarOptions = {
    showLabel: false,
    style: {
      backgroundColor: "#222222",
    },
  };

  const screenOptions = ({ route }) => ({
    tabBarIcon: ({ focused }) => {
      let iconName;

      switch (route.name) {
        case "Home":
          iconName = "home";
          return (
            <FontAwesome
              name={iconName}
              size={24}
              color={focused ? "#ffffff" : "#666666"}
            />
          );

        case "VocabSetStack":
          iconName = "book";
          return (
            <FontAwesome
              name={iconName}
              size={24}
              color={focused ? "#ffffff" : "#666666"}
            />
          );

        case "Notification":
          iconName = "bell";
          return (
            <View>
              {isRead === true && (
                <View
                  style={{
                    position: "absolute",
                    backgroundColor: "red",
                    width: 20,
                    height: 20,
                    borderRadius: 100,
                    alignItems: "center",
                    bottom: 12,
                    right: -5,
                    zIndex: 100,
                  }}
                >
                  <Text style={{ color: "#FFFFFF" }}>3</Text>
                </View>
              )}

              <FontAwesome
                name={iconName}
                size={24}
                color={focused ? "#ffffff" : "#666666"}
              />
            </View>
          );

        case "ProfileStackScreen":
          iconName = "user";
          return (
            <FontAwesome
              name={iconName}
              size={24}
              color={focused ? "#ffffff" : "#666666"}
            />
          );
      }
    },
  });

  return (
    <MainStack.Navigator
      tabBarOptions={tabBarOptions}
      screenOptions={screenOptions}
    >
      <MainStack.Screen name="Home" component={HomeScreen} />
      <MainStack.Screen name="VocabSetStack" component={VocabSetStackScreen} />
      <MainStack.Screen name="Notification" component={NotificationsScreen} />
      <MainStack.Screen
        name="ProfileStackScreen"
        component={ProfileStackScreen}
      />
    </MainStack.Navigator>
  );
};
