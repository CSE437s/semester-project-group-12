import React from 'react';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { auth } from './firebaseConfig';
import { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth"
import { Input, Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SignUpScreen = ({ navigation }) => {
  const [logInEmail, onChangeLogInEmail] = useState('');
  const [logInPassword, onChangeLogInPassword] = useState('');

  const logIn = async () => {
    try {
        await signInWithEmailAndPassword(auth, logInEmail, logInPassword);
        console.log("You're logged in!");
        // navigation.navigate("SearchScreen");
        // try {
        //     const neighborhoods = await getAllNeighborhoods(userCredential.user.uid);
        //     await AsyncStorage.setItem('neighborhoods', JSON.stringify(neighborhoods));
            
        // } catch (error) {
        //     console.error('Error saving data:', error);
        // }
   
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
    }
};
  return (
    <SafeAreaView style={styles.container}>

      <Input
        style={styles.input}
        placeholder="Email"
        leftIcon={<Icon name="email" type="material" />}
        onChangeText={onChangeLogInEmail}
        value={logInEmail}
      />
      <Input
        style={styles.input}
        placeholder="Password"
        leftIcon={<Icon name="lock" type="material" />}
        onChangeText={onChangeLogInPassword}
        value={logInPassword}
        secureTextEntry={true}

      />

      <TouchableOpacity style={styles.button} onPress={logIn}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    marginTop: 25
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20
  },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    width: 375,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

});
