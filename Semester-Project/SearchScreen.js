import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, FlatList, TouchableOpacity, Keyboard, View, Alert } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { deleteNeighborhood } from './PersonalData';
import { auth } from './firebaseConfig';

const SearchScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState({});
  const [userid, setUserid] = useState(null);
  const [newAdd, setNewAdd] = useState(null);

  const suggestionData = require('./STLNeighborhoods.json').neighborhoods;
  const isFocused = useIsFocused();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserid(currentUser.uid);
    } else {
      setUserid(null);
    }
}, []);

  useEffect(() => {
    if (isFocused) {
      console.log("focused");
      setTimeout(() => {
        loadData();
      }, 1000); 
    }
  }, [isFocused]);

  useEffect(() => {
    let index = Object.entries(neighborhoods).length
    console.log("index");
    if (index != 0) {
      navigation.navigate('ScoresViewScreen', { name: newAdd, index})
    }

  }, [newAdd]);

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
    console.log('loading');
    try {
        const data = await AsyncStorage.getItem('neighborhoods');
        console.log("data:");

        console.log(data);

        if (data && data !== "null" && data !== "undefined") {
            const parsedData = JSON.parse(data);
            setNeighborhoods(parsedData);
            console.log('Data loaded successfully:', parsedData);
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
};

  const deleteNeigh = (neighborhoodName) => {
    
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete ${neighborhoodName}?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Deletion canceled'),
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: async () => {
            const updatedNeighborhoods = { ...neighborhoods };
            delete updatedNeighborhoods[neighborhoodName];
            setNeighborhoods(updatedNeighborhoods);
            await deleteNeighborhood(userid, neighborhoodName);

            AsyncStorage.setItem('neighborhoods', JSON.stringify(updatedNeighborhoods))
              .then(() => console.log(`${neighborhoodName} deleted successfully`))
              .catch(error => console.error('Error deleting neighborhood:', error));
          },
          style: 'destructive'
        }
      ]
    );
  };

  const onPressedSuggestion = (item) => {
    navigation.navigate('ScoreScreen', { name: item,
      onGoBack: (data) => {
        setNewAdd(data);
      }
    })
    updateSearch('')
    Keyboard.dismiss()

  }

  const onPressedTab = (item, index) => {
    navigation.navigate('ScoresViewScreen', { name: item.neighborhood, index})
  }

  const renderSuggestion = ({ item }) => (
    <TouchableOpacity onPress={() => onPressedSuggestion(item)} style={styles.suggestionItem}>
      <Text style={styles.itemTitle}>{item}</Text>
    </TouchableOpacity>
  );

  const renderNeighborhoodTab = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => onPressedTab(item, index)}
      onLongPress={() => deleteNeigh(item.neighborhood)} // Long press to delete
      style={[styles.neighborhoodTab, { backgroundColor: getBackgroundColor(item.count) }]}
    >
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
      />
      {suggestions.length === 0 && search === '' && (
        <FlatList
          data={Object.entries(neighborhoods).map(([neighborhood, { count }]) => ({ neighborhood, count }))}
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