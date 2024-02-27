import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { auth } from './firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SearchScreen from './SearchScreen';
import SignUpScreen from './SignUpScreen';
import LogInScreen from './LogInScreen';
import ScoreScreen from './ScoreScreen';

// const NeighborhoodDetail = ({ name, rating }) => (
//   <View style={styles.neighborhoodDetailContainer}>
//     <Text style={styles.neighborhoodName}>{name}</Text>
//     <Text style={styles.neighborhoodRating}>{`Rating: ${rating}`}</Text>
//   </View>
// );
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [neighborhoods, setNeighborhoods] = useState({ "test": "test" });


  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem('neighborhoods');
      if (data !== null) {
        const parsedData = JSON.parse(data);
        setNeighborhoods(parsedData);
        print(parsedData)
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
      loadData();
    });
    return () => unsubscribe();

  }, []);


  const AuthenticatedStack = createNativeStackNavigator();
  const UnauthenticatedStack = createNativeStackNavigator();
  const NeighborhoodTab = createMaterialTopTabNavigator();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0d3b66" />
      </View>
    );
  }

  const logOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  return (
    <NavigationContainer>
      {user ? (
        <AuthenticatedStack.Navigator
          initialRouteName="SearchScreen"
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
          <AuthenticatedStack.Screen
            name="SearchScreen"
            component={SearchScreen}
            options={{
              title: 'Neighborhood Search',
              headerRight: () => (
                <TouchableOpacity onPress={logOut}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Log Out</Text>
                </TouchableOpacity>
              ),
            }}
          />
          <AuthenticatedStack.Group screenOptions={{ presentation: 'modal' }}>
            <AuthenticatedStack.Screen
              name="ScoreScreen"
              screenOptions={{ presentation: 'modal' }}
              component={ScoreScreen}
              options={{
                headerShown: false,
              }}
            />
          </AuthenticatedStack.Group>


        </AuthenticatedStack.Navigator>
      ) : (
        <UnauthenticatedStack.Navigator
          initialRouteName="SignUpScreen"
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
          <UnauthenticatedStack.Screen
            name="SignUpScreen"
            component={SignUpScreen}
            options={{ title: 'Sign Up' }}
          />
          <UnauthenticatedStack.Screen
            name="LogInScreen"
            component={LogInScreen}
            options={{ title: 'Sign In' }}
          />
        </UnauthenticatedStack.Navigator>

      )}
      {/* {Object.keys(neighborhoods).length > 0 && (
        <NeighborhoodTab.Navigator
        screenOptions={{
          tabBarShowLabel: false, // Hide labels
          tabBarStyle: { elevation: 0 }, // Remove shadow
        }}
        >
          {Object.entries(neighborhoods).map(([name, rating]) => (
            <NeighborhoodTab.Screen
              key={name}
              name={name}
            >
              {() => <NeighborhoodDetail name={name} rating={rating} />}
            </NeighborhoodTab.Screen>
          ))}
        </NeighborhoodTab.Navigator>
      )} */}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});