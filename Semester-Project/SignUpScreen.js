import React from 'react';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { auth } from './firebaseConfig';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth"


const SignUpScreen = ({navigation}) => {
  const [signUpEmail, onChangeSignUpEmail] = useState('');
  const [signUpPassword, onChangeSignUpPassword] = useState('');

  const signUp = () => {

    createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
      .then((userCredential) => {
        // Signed up 
        const user = auth.currentUser;
        navigation.reset({
          index: 0,
          routes: [{ name: 'SearchScreen' }],
        });
        console.log("You're signed up!");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
      });

  }
  const navToLogin = () => {
    navigation.navigate('LogInScreen')
    
  }

  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={onChangeSignUpEmail}
        value={signUpEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={onChangeSignUpPassword}
        value={signUpPassword}
        secureTextEntry
      />
     <TouchableOpacity style={styles.button} onPress={signUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

       <Text>Already have an account?
       <TouchableOpacity onPress={navToLogin}>
        <Text style={{ color: 'blue' }}> Click here </Text>
        </TouchableOpacity> to log in.</Text>

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
