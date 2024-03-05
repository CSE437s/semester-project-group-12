import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, SafeAreaView } from 'react-native';
import { PagerDotIndicator } from 'react-native-indicators';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const ScoresViewScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const scrollViewRef = useRef(null);
  const [numOfScreens, setNumOfScreens] = useState(0);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem('neighborhoods');
      if (data !== null) {
        const parsedData = JSON.parse(data);
        setNeighborhoods(parsedData);
        setNumOfScreens(Object.keys(parsedData).length);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const getBackgroundColor = (count) => {
    if (count !== null) {
      if (count > 70) {
        return { backgroundColor: '#d7481d', status: 'Dangerous' };
      } else if (count > 40) {
        return { backgroundColor: '#FFBF00', status: 'Fair' };
      } else {
        return { backgroundColor: '#26A65B', status: 'Safe' };
      }
    }
  };

  const generateScreen = (neighborhood) => {
    console.log(neighborhood)
    const count = neighborhood ? neighborhood[1] : null;

    return () => (
      <SafeAreaView style={styles.innerContainer}>
        <Text style={[styles.centeredText, styles.titleStyle]}>{neighborhood.neighborhood}</Text>
        <View style={[styles.borderBox, { backgroundColor: getBackgroundColor(count)?.backgroundColor }]}>
          <Text style={[styles.centeredText, styles.scoreStyle]}>{count !== null ? count : 'Loading...'}</Text>
        </View>
        <Text style={styles.statusText}> Danger Level: {getBackgroundColor(count)?.status}</Text>
      </SafeAreaView>
    );
  };

  const screens = Array.from({ length: numOfScreens }, (_, index) => {
    const screenIndex = index + 1;
    const entriesArray = Object.entries(neighborhoods);

    return {
      component: generateScreen(entriesArray[index]),
    };
  });

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / Dimensions.get('window').width);
    setCurrentIndex(index);
  };

  const scrollToIndex = (index) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: index * Dimensions.get('window').width, animated: true });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {screens.map((screen, index) => (
          <View key={index} style={{ width: Dimensions.get('window').width, borderWidth: 1, borderColor: 'red' }}>
            
            <Text>{screen.name}</Text>
            {screen.component()}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScoresViewScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredText: {
    textAlign: 'center',
    fontWeight: 'bold'
  },
  titleStyle: {
    color: "#fff",
    fontSize: 30,
  },
  scoreStyle: {
    color: "#fff",
    fontSize: 35,
  },
  statusText: {
    color: "#fff",
    fontSize: 20,
    marginTop: 10,
  },
  borderBox: {
    borderWidth: 4,
    borderColor: 'white',
    borderRadius: 70,
    paddingVertical: 40,
    paddingHorizontal: 30,
    marginVertical: 15,
    marginBottom: 350,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  addButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    borderRadius: 50,
  },
  cancelText: {
    fontSize: 20,
    color: '#fff',
  },
  addText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: "bold"
  },
});