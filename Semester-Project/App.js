import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { auth } from './firebaseConfig';

import SearchScreen from './SearchScreen';
import SignUpScreen from './SignUpScreen';
import LogInScreen from './LogInScreen';
import ScoreScreen from './ScoreScreen';

export default function App() {
  const [user, setUser] = useState(auth.currentUser);

  // useEffect(() => {
  //   setUser(auth.currentUser);
  // }, []);

  const Stack = createNativeStackNavigator();
  console.log(user)
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? 'SearchScreen' : 'SignUpScreen'}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0d3b66',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={{ title: 'Search' }}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{ title: 'Sign Up' }}
        />
       
        <Stack.Screen
          name="LogInScreen"
          component={LogInScreen}
          options={{ title: 'Log In' }}
        />
  

        <Stack.Screen name="ScoreScreen" component={ScoreScreen} options={{ title: 'Score' }} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({

});
