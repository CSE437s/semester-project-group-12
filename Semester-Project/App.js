import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, TextInput, Button } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { createUserWithEmailAndPassword, connectAuthEmulator } from "firebase/auth"
import { auth } from './firebaseConfig';

export default function App() {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');

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

  const signUp = async (email, password) => {
   console.log("email " + email)
   console.log("password " + password)
    console.log("pressed")
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        console.log(user)
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
        onChangeText={onChangeEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangePassword}
        value={password}
      />
      <Button
        title="Sign Up"
        onPress={signUp}
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
