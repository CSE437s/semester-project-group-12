import { React, useState } from 'react';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, TextInput, View } from 'react-native';
import { auth } from './firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth"
import { Input, Icon } from 'react-native-elements';


const SignUpScreen = ({ navigation }) => {
  const [signUpEmail, onChangeSignUpEmail] = useState('');
  const [signUpPassword, onChangeSignUpPassword] = useState('');
 
  
const signUp = async () => {
  try {
    // Create user with email and password
    await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
    console.log("You're signed up!");
    // Send email verification
    await sendEmailVerification(auth.currentUser);
    console.log("Verification email sent.");
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);
    // Handle errors
  }
};
  const navToLogin = () => {
    navigation.navigate('LogInScreen')

  }

  return (
    <SafeAreaView style={styles.container}>

      <Input
        style={styles.input}
        placeholder="Email"
        leftIcon={<Icon name="email" type="material" />}
        onChangeText={onChangeSignUpEmail}
        value={signUpEmail}
      />
      <Input
        style={styles.input}
        placeholder="Password"
        leftIcon={<Icon name="lock" type="material" />}
        onChangeText={onChangeSignUpPassword}
        value={signUpPassword}
        secureTextEntry={true}

      />
      <TouchableOpacity style={styles.button} onPress={signUp}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <Text>Already have an account? Click </Text>
        <TouchableOpacity onPress={navToLogin}>
          <Text style={{ color: 'blue' }}>here</Text>
        </TouchableOpacity>
        <Text> to log in.</Text>
      </View>
      
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
