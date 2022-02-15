import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ProfileScreen from "../screens/ProfileScreen";
import DetailsProfileScreen from "../screens/DetailsProfileScreen";

const ProfileStackScreen = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen
        name="DetailsProfileScreen"
        component={DetailsProfileScreen}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackScreen;
