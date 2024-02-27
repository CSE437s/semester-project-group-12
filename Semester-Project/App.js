import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { auth } from './firebaseConfig';

import SearchScreen from './SearchScreen';
import SignUpScreen from './SignUpScreen';
import LogInScreen from './LogInScreen';
import ScoreScreen from './ScoreScreen';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const AuthenticatedStack = createNativeStackNavigator();
  const UnauthenticatedStack = createNativeStackNavigator();

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
              title: 'Search',
              headerRight: () => (
                <TouchableOpacity
                  style={{ marginRight: 16 }}
                  onPress={logOut}
                >
                  <Text style={{ color: 'white' }}>Log Out</Text>
                </TouchableOpacity>
              ),
            }}
          />
          <AuthenticatedStack.Screen
            name="ScoreScreen"
            component={ScoreScreen}
            options={{ title: 'Score' }}
          />
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