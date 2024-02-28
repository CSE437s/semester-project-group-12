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
    loadData();
    console.log("shown")
  }, []);

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

  const onPressedSuggestion = (item) => {
    navigation.navigate('ScoreScreen', { name: item })
    updateSearch('')
    Keyboard.dismiss()

  }

  const onPressedTab = (item) => {
    navigation.navigate('ScoreScreen', { name: item.neighborhood })
  }

  const renderSuggestion = ({ item }) => (
    <TouchableOpacity onPress={() => onPressedSuggestion(item)} style={styles.suggestionItem}>
      <Text style={styles.itemTitle}>{item}</Text>
    </TouchableOpacity>
  );

  const renderNeighborhoodTab = ({ item }) => (
    <TouchableOpacity onPress={() => onPressedTab(item)} style={[styles.neighborhoodTab, { backgroundColor: getBackgroundColor(item.count) }]}>
      <View style={styles.tabContent}>
        <Text style={styles.tabText}>{item.neighborhood}</Text>
        <Text style={styles.tabCount}>{item.count}</Text>
      </View>
    </TouchableOpacity>
  );

  const getBackgroundColor = (count) => {
    if (count !== null) {
        if (count > 70) {
            return '#d7481d'; // Red
        } else if (count > 40) {
            return '#FFBF00'; // Yellow
        } else {
            return '#26A65B'; // Green
        }
    } else {
        return '#26A65B'; // Default color when count is null (loading)
    }
};

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        placeholder="Search for a STL neighborhood"
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
        styles={styles.neighborhoodTabs}
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
  neighborhoodTabs: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  neighborhoodTab: {
    padding: 25,
    flexDirection: 'row',
    marginBottom: 5,
    marginLeft: 9,
    width: '95%',
    borderRadius: 20,
  },
  tabContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',

  },
  tabText: {
    color: '#fff',
    fontSize: 25,
  },
  tabCount: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});