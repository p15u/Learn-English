import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { UserProvider } from './src/context/UserContext';
import { FirebaseProvider } from './src/context/FirebaseContext';

import AppStackScreens from './src/stacks/AppStackScreens';
import vocabApi from './src/api/vocabApi';

export default App = () => {

  return (
    <FirebaseProvider>
      <UserProvider>
        <NavigationContainer>
          <AppStackScreens />
        </NavigationContainer>
      </UserProvider>
    </FirebaseProvider>
  )
}