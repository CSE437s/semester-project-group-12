import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { auth } from './firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllNeighborhoods } from './PersonalData';

import SearchScreen from './SearchScreen';
import SignUpScreen from './SignUpScreen';
import LogInScreen from './LogInScreen';
import ScoreScreen from './ScoreScreen';
import ScoresViewScreen from './ScoresViewScreen';
import * as Location from 'expo-location';


// const NeighborhoodDetail = ({ name, rating }) => (
//   <View style={styles.neighborhoodDetailContainer}>
//     <Text style={styles.neighborhoodName}>{name}</Text>
//     <Text style={styles.neighborhoodRating}>{`Rating: ${rating}`}</Text>
//   </View>
// );
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uidLoaded, setUidLoaded] = useState(false);
  const [location, setLocation] = useState(); 

    useEffect(() => {
        const getPermissions = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log("Please grant location permissions");
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);
            console.log("Location:");
            console.log(currentLocation.coords.longitude);
            console.log(currentLocation.coords.latitude);
        };
        getPermissions();
    }, []);

  const loadData = async (uid) => {
    try {
      console.log(uid);
      const neighborhoods = await getAllNeighborhoods(uid);
      await AsyncStorage.setItem('neighborhoods', JSON.stringify(neighborhoods));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      setUser(authUser);
      setLoading(false);

      if (authUser) {
        await loadData(authUser.uid);
        setUidLoaded(true);
      }
    });

    return () => unsubscribe();
  }, []);


  const AuthenticatedStack = createNativeStackNavigator();
  const UnauthenticatedStack = createNativeStackNavigator();
  // const NeighborhoodTab = createMaterialTopTabNavigator();

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
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  return (
    <NavigationContainer>
      {(user && uidLoaded) ? (
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
              animation: 'fade',
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
          
          <AuthenticatedStack.Group>
            <AuthenticatedStack.Screen
              name="ScoresViewScreen"
              component={ScoresViewScreen}
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