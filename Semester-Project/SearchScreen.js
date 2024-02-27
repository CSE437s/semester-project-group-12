import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { SearchBar, Button } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { auth } from './firebaseConfig';

const SearchScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [neighborhoods, setNeighorhoods] = useState([]);

  const suggestionData = require('./STLNeighborhoods.json').neighborhoods;

  const updateSearch = (text) => {
    setSearch(text);
    if (text !== '') {
      setSuggestions(suggestionData.filter(item =>
        item.toLowerCase().includes(text.toLowerCase())
      ));
    } else {
      setSuggestions([]);
    }
  };

  const logOut = async () => {
    try {
      await auth.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignUpScreen' }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  const onCancel = () => {
    console.log("cancelled")
  }
  
  const renderSuggestion = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ScoreScreen', { name: item })} style={styles.suggestionItem}>
      <Text style={styles.itemTitle}>{item}</Text>
    </TouchableOpacity>
  );

  const renderNeighborhoodTab = ({ item }) => (
    <TouchableOpacity>
      <Text>{item}</Text>
    </TouchableOpacity>
  );
  
  

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        placeholder="Type your neighborhood here..."
        clearIcon
        onChangeText={updateSearch}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInputContainer}
        inputStyle={styles.searchInput}
        value={search}
        onClear={onCancel}
      />
      
      <FlatList
        data={suggestions}
        renderItem={renderSuggestion}
        keyExtractor={(item) => item}
      />

      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchInputContainer: {
    backgroundColor: '#edede9',
    borderRadius: 10,
  },
  searchInput: {
    color: '#003049',
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#003049',
  },
  itemTitle: {
    color: '#003049',
    fontSize: 18
  }
});