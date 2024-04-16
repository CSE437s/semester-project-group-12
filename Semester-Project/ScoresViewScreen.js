import { React, useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator, Share, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Slider from '@react-native-community/slider';
import { db, auth } from './firebaseConfig';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

import neighborhoodsData from './neighborhoods.json';
import { neighborhoodMapping } from './stldata';
import { findNeighborhood } from './getUserNeighborhood';
import { countDocumentsByNeighborhood } from './GetScore'
import * as Location from 'expo-location';

const ratingImages = {
  5: require('./assets/Rating Emojis/Happy.png'),
  4: require('./assets/Rating Emojis/Smile.png'),
  3: require('./assets/Rating Emojis/Neutral.png'),
  2: require('./assets/Rating Emojis/Sad.png'),
  1: require('./assets/Rating Emojis/Angry.png'),
};

const ScoresViewScreen = ({ navigation, route }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentNeighborhood, setCurrentNeighborhood] = useState("");
  const [neighborhoods, setNeighborhoods] = useState([]);
  const scrollViewRef = useRef(null);
  const [numOfScreens, setNumOfScreens] = useState(0);
  const isFocused = useIsFocused();
  const [location, setLocation] = useState(null);
  const [rating, setRating] = useState(3);
  const [hasRated, setHasRated] = useState([]);
  const [avgRating, setAvgRating] = useState(3);

  const { index } = route.params;


  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  useEffect(() => {
    setCurrentIndex(index);
  }, [index]);

  useEffect(() => {
    fetchAverageRating();
  }, [currentNeighborhood]);

  const getRatingImage = (rating) => {
    return ratingImages[rating];
  };

  const sendRatingToFirestore = async () => {
    const neighborhoodName = currentNeighborhood;
    const ratingValue = rating;
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    if (!userId) {
      console.log('User is not logged in.');
      return;
    }

    try {
      // Check if the user has already rated this neighborhood
      const ratingsRef = collection(db, 'user_ratings');
      const q = query(ratingsRef, where('neighborhood', '==', neighborhoodName), where('userId', '==', userId));

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        console.log('You have already rated this neighborhood.');
        return;
      }

      await addDoc(ratingsRef, {
        neighborhood: neighborhoodName,
        rating: ratingValue,
        userId: userId,
        timestamp: new Date(),
      });

      console.log('Rating sent to Firestore successfully!');
      fetchAverageRating();
      setHasRated(prevHasRated => {
        const newHasRated = [...prevHasRated]; 
        newHasRated[currentIndex] = true; 
        return newHasRated;
      });
    } catch (error) {
      console.error("Error adding document to Firestore: ", error);
    }
  };
  const checkHasRated = async (neighborhoodName) => {
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    try {
      // Check if the user has already rated this neighborhood
      const ratingsRef = collection(db, 'user_ratings');
      const q = query(ratingsRef, where('neighborhood', '==', neighborhoodName), where('userId', '==', userId));

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error checking if user has rated: ", error);
      return false;
    }
  }
  const fetchAverageRating = async () => {
    const neighborhoodName = currentNeighborhood;

    // Ensure there's a valid neighborhood name to search for
    if (!neighborhoodName) {
      console.log('Current neighborhood is not set.');
      return;
    }

    try {
      const ratingsRef = collection(db, 'user_ratings');
      const q = query(ratingsRef, where('neighborhood', '==', neighborhoodName));

      const querySnapshot = await getDocs(q);
      let totalRatings = 0;
      let ratingsCount = 0;

      querySnapshot.forEach((doc) => {
        totalRatings += doc.data().rating;
        ratingsCount += 1;
      });

      // Check if there are any ratings to avoid division by zero
      if (ratingsCount > 0) {
        const averageRating = totalRatings / ratingsCount;
        setAvgRating(averageRating * 20);
      } else {
        console.log(`No ratings found for ${neighborhoodName}.`);
      }
    } catch (error) {
      console.error("Error fetching ratings from Firestore: ", error);
    }
  };




  const loadData = async () => {
    try {
      const storedLocation = await AsyncStorage.getItem('currentLocation');
      if (storedLocation !== null) {
        const parsedLocation = JSON.parse(storedLocation);
        console.log("Current location retrieved from AsyncStorage:");
        setLocation(parsedLocation)
      } else {
        console.log("No current location found in AsyncStorage.");
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    const neighborhoodData = await AsyncStorage.getItem('neighborhoods');
    if (neighborhoodData !== null) {
      const parsedData = JSON.parse(neighborhoodData);
      setCurrentNeighborhood(Object.entries(parsedData)[0][0]);


      // const currentLoc = findNeighborhood(location["longitude"], location["latitude"])
      // if (currentLoc == null) {
      //   const additionalEntry = {
      //     [currentLoc]: { count: null, ratio: null}
      //   };
      //   parsedData = { ...additionalEntry, ...parsedData };
      // } else {
      //   const [count, ratio] = countDocumentsByNeighborhood(currentLoc);

      //   const additionalEntry = {
      //     [currentLoc]: { count: count, ratio: ratio}
      //   };

      //   // Merge the new object with the existing parsedData
      //   parsedData = { ...additionalEntry, ...parsedData };
      // }
      setNeighborhoods(parsedData);
      setNumOfScreens(Object.keys(parsedData).length);
      setCurrentIndex(index);

      const entriesArray = Object.entries(parsedData);
      const resultsArray = await Promise.all(entriesArray.map(async ([key]) => {
        return await checkHasRated(key);
      }));
      setHasRated(resultsArray);

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

  function calculateCentroid(polygon) {
    let x = 0, y = 0, area = 0;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0], yi = polygon[i][1];
      const xj = polygon[j][0], yj = polygon[j][1];
      const f = xi * yj - xj * yi;
      x += (xi + xj) * f;
      y += (yi + yj) * f;
      area += f * 3;
    }
    return area ? [x / area, y / area] : [0, 0];
  }

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
              <Text style={styles.scoreComparisonText}>{ratio > 0 ? ratio.toFixed(2) + "% more safe \n compared to the \n national average" : -ratio.toFixed(2) + "% more dangerous \n compared to the \n national average"}</Text>
            </>
          ) : null}
        </View>
        <>
          {hasRated[currentIndex] ? (
            <View style={styles.avgRatingContainer}>
              <Text style={styles.avgUserRatingText}>{"Average\nUser Rating:"}</Text>
              <Text style={styles.avgUserRatingText}>{120 - avgRating}</Text>
            </View>
          ) : (

            <View style={styles.ratingContainer}>
              <Image style={styles.ratingImage} source={getRatingImage(rating)} />

              <Slider
                style={{ width: 200, height: 40 }}
                minimumValue={1}
                maximumValue={5}
                step={1}
                value={rating}
                onValueChange={setRating}
                thumbTintColor='white'
                minimumTrackTintColor="white"
              />
              {
                rating > 0 && (
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={sendRatingToFirestore}
                  >
                    <Text style={styles.submitButtonText}>Submit Rating</Text>
                  </TouchableOpacity>
                )
              }
            </View>)}
        </>





        <Text style={styles.statusText}> Danger Level: {getBackgroundColor(count)?.status}</Text>
      </SafeAreaView>
    );
  };

  // Add your current location screen here
  const generateCurrentLocationScreen = () => {

    if (!location) {
      // Location data not available yet, return null or a loading indicator
      return () => {
        <SafeAreaView style={styles.container}>
          <ActivityIndicator size="large" color="#0d3b66" />
        </SafeAreaView>
      };
    }

    return () => (
      <SafeAreaView style={styles.container}>
        <Text>Latitude: {location.latitude}</Text>
        <Text>Longitude: {location.longitude}</Text>
      </SafeAreaView>
    );


  };


  const currentLocationScreen = {
    key: "currentLocation",
    component: generateCurrentLocationScreen()
  };


  const screens = Array.from({ length: numOfScreens }, (_, index) => {
    const entriesArray = Object.entries(neighborhoods);
    const [neighborhood, data] = entriesArray[index];
    return {
      key: neighborhood,
      component: generateScreen(neighborhood, data),
    };
  });


  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / Dimensions.get('window').width);
    setCurrentIndex(index);

    const entriesArray = Object.entries(neighborhoods);

    if (entriesArray.length > 0 && index - 1 < entriesArray.length) {
      const [neighborhood, data] = entriesArray[index];
      setCurrentNeighborhood(neighborhood);
      fetchAverageRating();

    }

  };

  const renderItem = ({ item }) => (
    <View style={{ width: Dimensions.get('window').width }}>
      {item.component()}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0d3b66" }}>
      <FlatList
        data={screens}
        ref={scrollViewRef}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={10}
        initialScrollIndex={currentIndex}
        keyExtractor={item => item.key}
        getItemLayout={(data, index) => ({
          length: Dimensions.get('window').width,
          offset: Dimensions.get('window').width * index,
          index,
        })}
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomBarButton}
          onPress={() => {
            console.log("Current Neighborhood: " + currentNeighborhood)

            const feature = neighborhoodsData.features.find(f => f.properties.NHD_NUM === neighborhoodMapping[currentNeighborhood]);
            if (!feature) {
              navigation.navigate('MapScreen', { long: -90.236402, lat: 38.627003 });
            } else {
              const outerBoundary = feature.geometry.coordinates[0];
              const centroid = calculateCentroid(outerBoundary);
              navigation.navigate('MapScreen', { long: centroid[0], lat: centroid[1] });
            };

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
    marginBottom: 20,
    marginTop: -50
  },
  scoreStyle: {
    color: "#fff",
    fontSize: 50,
  },
  statusText: {
    color: "#fff",
    fontSize: 20,
    marginTop: 5,
  },
  borderBox: {
    borderWidth: 4,
    borderColor: 'white',
    borderRadius: 80,
    paddingVertical: 45,
    paddingHorizontal: 45,
    marginVertical: 15,
    marginBottom: 20,
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomBarButton: {
    paddingVertical: 10,
    paddingHorizontal: 0,
    marginBottom: '5%'
  },
  scoreComparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '1%',
    marginBottom: '7%'

  },
  scoreComparisonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  avgRatingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '75%',
    height: '30%',
    padding: 20,
    marginBottom: '7%',

  },
  ratingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '75%',
    height: '30%',
    padding: 20,
    borderWidth: 4,
    borderColor: 'white',
    borderRadius: 10,
    marginBottom: '7%',

  },
  ratingImage: {
    width: 60,
    height: 60,
    marginBottom: '5%',
  },
  submitButton: {
    padding: 15,
    borderWidth: 4,
    borderColor: 'white',
    borderRadius: 10,
    marginTop: '5%',

  },
  submitButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  avgUserRatingText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: '10%',
    textAlign: 'center',
  }
});