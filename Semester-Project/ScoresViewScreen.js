import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import * as Location from 'expo-location';


const ScoresViewScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const scrollViewRef = useRef(null);
  const [numOfScreens, setNumOfScreens] = useState(0);
  const [currentColor, setCurrentColor] = useState("white");
  const isFocused = useIsFocused();
  const [long, setLong] = useState("");
  const [lat, setLat] = useState("");


  useEffect(() => {
    if (isFocused) {
      loadData();
      // scrollToIndex(3)
    }
  }, [isFocused]);

  const loadData = async () => {
    try {
      // let currentLocation = await Location.getCurrentPositionAsync({});
      // setLat(currentLocation.coords.latitude);
      // setLong(currentLocation.coords.longitude);
      const data = await AsyncStorage.getItem('neighborhoods');
      if (data !== null) {
        const parsedData = JSON.parse(data);
        setNeighborhoods(parsedData);
        setNumOfScreens(Object.keys(parsedData).length)
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

  const generateScreen = (neighborhood, data) => {
    const count = data.count;
    const ratio = data.ratio;

    return () => (
      <SafeAreaView style={[styles.container, { backgroundColor: getBackgroundColor(count)?.backgroundColor }]}>
        <Text style={[styles.centeredText, styles.titleStyle]}>{neighborhood}</Text>
        <View style={[styles.borderBox, { backgroundColor: getBackgroundColor(count)?.backgroundColor }]}>
          <Text style={[styles.centeredText, styles.scoreStyle]}>{count !== null ? count : 'Loading...'}</Text>
        </View>
        <View style={styles.scoreComparisonContainer}>
          {ratio !== null && ratio !== undefined ? (
            <>
              {/* <FontAwesomeIcon name={ratio > 0 ? "caret-up" : "caret-down"} size={30} color="white" /> */}
              <Text style={styles.scoreComparisonText}>{ratio > 0 ? ratio.toFixed(2) + "% more safe \n compared to the \n national average" : -ratio.toFixed(2) + "% more dangerous \n compared to the \n national average"}</Text>
            </>
          ) : null}
        </View>
        <Text style={styles.statusText}> Danger Level: {getBackgroundColor(count)?.status}</Text>
      </SafeAreaView>
    );
  };

  // Add your current location screen here
  const generateCurrentLocationScreen = () => {



    return () => (
      <SafeAreaView style={styles.container}>
        <Text>{long}</Text>
        <Text>{lat}</Text>
      </SafeAreaView>
    );


  };


  const currentLocationScreen = {
    component: generateCurrentLocationScreen()
  };


  const screens = Array.from({ length: numOfScreens }, (_, index) => {
    const entriesArray = Object.entries(neighborhoods);
    const [neighborhood, data] = entriesArray[index];
    return {
      component: generateScreen(neighborhood, data),
    };
  });

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / Dimensions.get('window').width);
    setCurrentIndex(index);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {screens.map((screen, index) => (
          <View key={index} style={{ width: Dimensions.get('window').width, borderWidth: 1, borderColor: "white" }}>

            {screen.component()}
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomBarButton}
          onPress={() => {
            navigation.navigate('MapScreen');
          }}
        >
          <FontAwesomeIcon name="map" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomBarButton}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <FontAwesomeIcon name="list" size={24} color="white" />
        </TouchableOpacity>
      </View>
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
    marginBottom: 25,
  },
  scoreStyle: {
    color: "#fff",
    fontSize: 50,
  },
  statusText: {
    color: "#fff",
    fontSize: 20,
    marginTop: 10,
  },
  borderBox: {
    borderWidth: 4,
    borderColor: 'white',
    borderRadius: 80,
    paddingVertical: 45,
    paddingHorizontal: 45,
    marginVertical: 15,
    marginBottom: 15,
    marginTop: 10,
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
  map: {
    width: '100%',
    height: '100%',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0d3b66',
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomBarButton: {
    paddingVertical: 10,
    paddingHorizontal: 0,
    marginBottom: 15
  },
  scoreComparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 250,
    marginTop: 10,

  },
  scoreComparisonText: {
    marginLeft: 5,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
});