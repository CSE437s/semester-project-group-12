import { React, useState, useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, Modal, View} from 'react-native';
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth"
import { Input, Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SignUpScreen = ({ navigation }) => {
  const [logInEmail, onChangeLogInEmail] = useState('');
  const [logInPassword, onChangeLogInPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [errorText, setErrorText] = useState("");

  const logIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, logInEmail, logInPassword);
      if (userCredential.user.emailVerified) {
        console.log("You're logged in!");
      } else {
        setErrorText("Email hasn't been verified.");
        setModalVisible(true);
      }
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
      switch (errorCode) {
        case 'auth/invalid-credential':
          setErrorText("Incorrect email or password.\nPlease try again.");
          setModalVisible(true);
          break;
        default:
          console.log(errorMessage);
          setErrorText("Error: " + errorMessage);
          setModalVisible(true);
          break;
      }
    }

  };
  useEffect(() => {
    if (modalVisible) {
      const timer = setTimeout(() => {
        setModalVisible(false);
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [modalVisible]);

  /*
  const signInWithGoogle = async () => {
    try {
      await GoogleOneTapSignIn.hasPlayServices();
      const userInfo = await GoogleOneTapSignIn.signIn();
      console.log(userInfo);
      // Handle the successful login here (e.g., navigate to another screen)
    } catch (error) {
      console.error(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // Handle sign-in cancelled by the user
      } else {
        // Handle other errors
      }
    }

  };
  */
//<Button title="Sign In with Google" onPress={signInWithGoogle} />
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
