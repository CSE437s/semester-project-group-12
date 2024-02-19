import React from 'react';
import { View, Text } from 'react-native';
import { auth } from './firebaseConfig';
import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { Text, View, SafeAreaView, TextInput, Button } from 'react-native';


const SignUp = () => {
    const [signUpEmail, onChangeSignUpEmail] = useState('');
    const [signUpPassword, onChangeSignUpPassword] = useState('');
    const [logInEmail, onChangeLogInEmail] = useState('');
    const [logInPassword, onChangeLogInPassword] = useState('');

    const signUp = () => {
  
        createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
          .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log("You're signed up!");
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
          });
    
      }
    
      const logIn = () => {
      
        signInWithEmailAndPassword(auth, logInEmail, logInPassword)
          .then((userCredential) => {
            // Logged in 
            const user = userCredential.user;
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
        <SafeAreaView>
            <Text>
            </Text>
            <TextInput
                style={styles.input}
                onChangeText={onChangeSignUpEmail}
                value={signUpEmail}
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeSignUpPassword}
                value={signUpPassword}
            />
            <Button
                title="Sign Up"
                onPress={signUp}
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeLogInEmail}
                value={logInEmail}
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeLogInPassword}
                value={logInPassword}
            />
            <Button
                title="Log in"
                onPress={logIn}
            />
        </SafeAreaView>
    );
};

export default SignUp;