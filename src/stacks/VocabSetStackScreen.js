import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import CreateVocabScreen from "../screens/VocabSetSceens/CreateVocabScreen";
import ManageVocabSetScreen from "../screens/VocabSetSceens/ManageVocabSetScreen";
import VocabSetDetails from "../screens/VocabSetSceens/VocabSetDetails";
import LearnVocabs from "../screens/VocabSetSceens/LearnVocabs";
import TestVocabsScreen from "../screens/VocabSetSceens/TestVocabsScreen";

const VocabSetStackScreen = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen
        name="ManageVocabSetScreen"
        component={ManageVocabSetScreen}
      />
      <Stack.Screen name="CreateVocabScreen" component={CreateVocabScreen} />
      <Stack.Screen name="VocabSetDetails" component={VocabSetDetails} />
      <Stack.Screen name="LearnVocabs" component={LearnVocabs} />
      <Stack.Screen name="TestVocabsScreen" component={TestVocabsScreen} />
    </Stack.Navigator>
  );
};

export default VocabSetStackScreen;
