import React from 'react';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { auth } from './firebaseConfig';
import { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth"


const SignUpScreen = ({navigation}) => {
  const [logInEmail, onChangeLogInEmail] = useState('');
  const [logInPassword, onChangeLogInPassword] = useState('');

  const logIn = () => {

    signInWithEmailAndPassword(auth, logInEmail, logInPassword)
      .then((userCredential) => {
        // Logged in 
        const user = auth.currentUser;
        console.log(user)
        navigation.reset({
          index: 0,
          routes: [{ name: 'SearchScreen' }],
        });
        console.log("You're logged in!");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
      });

  }
  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>Log In</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={onChangeLogInEmail}
        value={logInEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={onChangeLogInPassword}
        value={logInPassword}
        secureTextEntry
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    width: '90%',
  },
  button: {
    backgroundColor: '#3498db', // Example color, you can change it
    padding: 10,
    borderRadius: 5,
    width: 350,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', // Text color
    fontSize: 20,
    fontWeight: 'bold',
  },

});
