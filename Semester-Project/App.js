import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, FlatList } from 'react-native';
import { SearchBar } from 'react-native-elements';

export default function App() {
  const [search, setSearch] = useState('');

  const updateSearch = (text) => {
    setSearch(text);
    
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        placeholder="Type Here..."
        onChangeText={updateSearch}
        containerStyle={{ width: '100%' }}
        value={search}
      />
     
      <StatusBar style="auto" />
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
 
  
});
