import { React, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, TouchableOpacity, Button } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';

const SearchScreen = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);

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

    // const handleItemClick = (item) => {
    //     console.log("Clicked item:", item);
    // }

    const renderSuggestion = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('ScoreScreen', {name: item})} style={styles.suggestionItem}>
            <Text>{item}</Text>
        </TouchableOpacity>

    );



    return (
        <SafeAreaView>
            <View style={styles.container}>
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

            <StatusBar style="auto" />
           
        </SafeAreaView>
    );

};

export default SearchScreen;

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