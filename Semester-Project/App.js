import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, TextInput, Button } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from './firebaseConfig';

export default function App() {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [signUpEmail, onChangeSignUpEmail] = useState('');
  const [signUpPassword, onChangeSignUpPassword] = useState('');
  const [logInEmail, onChangeLogInEmail] = useState('');
  const [logInPassword, onChangeLogInPassword] = useState('');

  const suggestionData = require('./STLNeighborhoods.json').neighborhoods;

  const updateSearch = (text) => {
    setSearch(text);
    if (text != '') {
      setSuggestions(suggestionData.filter(item =>
        item.toLowerCase().includes(text.toLowerCase())
      ));
    } else {
      setSuggestions([]);
    }

  };

  const handleItemClick = (item) => {
    console.log("Clicked item:", item);
  }

  const renderSuggestion = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemClick(item)} style={styles.suggestionItem}>
      <Text>{item}</Text>
    </TouchableOpacity>

  );

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
      {/* <View style={styles.container}>
        <SearchBar
          placeholder="Type your neighborhood here..."
          onChangeText={updateSearch}
          containerStyle={{ width: '100%' }}
          value={search}
        />
      </View>


      <View>
        <FlatList
          data={suggestions}
          renderItem={renderSuggestion}
          keyExtractor={(item) => item}
        />
      </View>

      <StatusBar style="auto" /> */}
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
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },


});
