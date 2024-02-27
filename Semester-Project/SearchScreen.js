import { React, useState, useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, FlatList, TouchableOpacity, Keyboard, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { auth } from './firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';


const SearchScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState({});

  const suggestionData = require('./STLNeighborhoods.json').neighborhoods;
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadData();
    } 
  }, [isFocused]);

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

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem('neighborhoods');
      if (data !== null) {
        const parsedData = JSON.parse(data);
        setNeighborhoods(parsedData);
        console.log('Data loaded successfully:', parsedData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onCancel = () => {
    console.log("cancelled")
  }

  const onPressed = (item) => {
    navigation.navigate('ScoreScreen', { name: item })
    updateSearch('')
    Keyboard.dismiss()

  }

  const renderSuggestion = ({ item }) => (
    <TouchableOpacity onPress={() => onPressed(item)} style={styles.suggestionItem}>
      <Text style={styles.itemTitle}>{item}</Text>
    </TouchableOpacity>
  );

  const renderNeighborhoodTab = ({ item }) => (
    <TouchableOpacity onPress={() => console.log("pressed")} style={styles.neighborhoodTab}>
      <View style={styles.tabContent}>
        <Text style={styles.tabText}>{item.neighborhood}</Text>
        <Text style={styles.tabCount}>{item.count}</Text>
      </View>   
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
      {suggestions.length === 0 && search === '' && (
        <FlatList
          data={Object.entries(neighborhoods).map(([neighborhood, count]) => ({ neighborhood, count }))}
          renderItem={renderNeighborhoodTab}
          keyExtractor={(item) => item.neighborhood}
        />
      )}
      <FlatList
        data={suggestions}
        renderItem={renderSuggestion}
        keyExtractor={(item) => item}
        keyboardShouldPersistTaps="handled"
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
  },
  neighborhoodTab: {
    padding: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#26A65B',
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 5
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  tabText: {
    color: '#003049',
    fontSize: 25,
    marginRight: 10, // Adjust the spacing between name and count
  },
  tabCount: {
    color: '#003049',
    fontSize: 25,
    fontWeight: 'bold',
  },
});