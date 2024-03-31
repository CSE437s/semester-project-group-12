import { React, useState, useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, Modal, View, Button } from 'react-native';
import { auth } from './firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import { Input, Icon } from 'react-native-elements';


const SignUpScreen = ({ navigation }) => {
  const [signUpEmail, onChangeSignUpEmail] = useState('');
  const [signUpPassword, onChangeSignUpPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [errorText, setErrorText] = useState("");

  const signUp = async () => {
    try {
      // Create user with email and password
      await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
      console.log("You're signed up!");
      // Send email verification
      await sendEmailVerification(auth.currentUser);
      console.log("Verification email sent.");
      let userVerified = false;
      setErrorText("Email verification sent!");
      setModalVisible(true);
      while (!userVerified) {
        await auth.currentUser.reload();
        userVerified = auth.currentUser.emailVerified;
        if (!userVerified) {
          await new Promise(resolve => setTimeout(resolve, 3)); // Wait for 10 seconds before checking again
        }
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      switch (errorCode) {
        case 'auth/email-already-in-use':
          setErrorText("Email is already in use.");
          setModalVisible(true);
          break;
        case 'auth/weak-password':
          setErrorText("Password is too weak.");
          setModalVisible(true);
          break;
        default:
          setErrorText("Error: " + errorMessage);
          setModalVisible(true);          
          break;
      }
    }
  };
  const navToLogin = () => {
    navigation.navigate('LogInScreen')
  }

  useEffect(() => {
    if (modalVisible) {
      const timer = setTimeout(() => {
        setModalVisible(false);
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [modalVisible]);

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.floaterBackgroud}>
          <View style={styles.floaterForeground}>
            <Text numberOfLines={3} style={styles.floaterText}>{errorText}</Text>

          </View>
        </View>
      </Modal>
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
  floaterBackgroud: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  floaterForeground: {
    backgroundColor: 'white',
    padding: 15,
    marginTop: 60,
    width: '75%',
    height: '9%',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#3498db',
    justifyContent: 'center'

  },
  floaterText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
