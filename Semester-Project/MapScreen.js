import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, Image, ActivityIndicator, Text } from 'react-native';
import MapView, { Geojson, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import countDocumentsByNeighborhood from './GetScore'; 
import { neighborhoodMapping } from './stldata';
import neighborhoodsData from './neighborhoods.json';
import userLocationImage from './userLocation.png'; // Make sure this path is correct
import { useRoute } from '@react-navigation/native';

const MapScreen = ({ navigation }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [safetyScores, setSafetyScores] = useState({});
    const mapRef = useRef(null);
    const route = useRoute();
    const { long, lat } = route.params;

    const getMarkerColor = (score) => {
        if (score === undefined) return 'white';
        const scoreNum = Number(score);
        if (scoreNum > 70) return 'red';
        if (scoreNum > 40) return 'yellow';
        return 'green';
    };

    const saveLocation = async (location) => {
        try {
            const jsonValue = JSON.stringify(location);
            await AsyncStorage.setItem('userLocation', jsonValue);
        } catch (e) {
            console.log("Error saving location", e);
        }
    };

    const loadLocation = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('userLocation');
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.log("Error loading location", e);
        }
    };

    useEffect(() => {
        (async () => {
             
                mapRef.current?.animateToRegion({
                    latitude: lat,
                    longitude: long,
                    latitudeDelta: 0.025,
                    longitudeDelta: 0.025,
                }, 1000);
             const storedLocation = await loadLocation();
             if (storedLocation) {
                 setUserLocation(storedLocation);
             //    mapRef.current?.animateToRegion({
             //        latitude: storedLocation.latitude,
             //        longitude: storedLocation.longitude,
             //        latitudeDelta: 0.08,
             //        longitudeDelta: 0.08,
             //    }, 1000);
             } else {
                 let { status } = await Location.requestForegroundPermissionsAsync();
                 if (status !== 'granted') {
                     console.log("Location permission not granted");
                     return;
                 }

                 let currentLocation = await Location.getCurrentPositionAsync({});
                 setUserLocation(currentLocation.coords);
                 saveLocation(currentLocation.coords);

            //     mapRef.current?.animateToRegion({
            //         latitude: currentLocation.coords.latitude,
            //         longitude: currentLocation.coords.longitude,
            //         latitudeDelta: 0.08,
            //         longitudeDelta: 0.08,
            //     }, 1000);
             }
        })();
    }, []);

    const saveScoresToStorage = async (scores) => {
        try {
            const timestampedScores = { scores, timestamp: new Date().getTime() };
            const jsonValue = JSON.stringify(timestampedScores);
            await AsyncStorage.setItem('safetyScores', jsonValue);
        } catch (e) {
            console.log("Error saving scores", e);
        }
    };

    const loadScoresFromStorage = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('safetyScores');
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.log("Error loading scores", e);
        }
    };

    useEffect(() => {
        const fetchSafetyScores = async () => {
            const storedScoresData = await loadScoresFromStorage();
            const oneDay = 24 * 60 * 60 * 1000; // Time in milliseconds
            if (storedScoresData && new Date().getTime() - storedScoresData.timestamp < oneDay) {
                setSafetyScores(storedScoresData.scores);
            } else {
                try {
                    const scorePromises = Object.keys(neighborhoodMapping).map(name =>
                        countDocumentsByNeighborhood(name).then(score => ({ name, score }))
                            .catch(error => {
                                console.error(`Failed to fetch score for ${name}:`, error);
                                return { name, score: null }; // Ensure failure for one does not stop the others
                            })
                    );
                    const scoresArray = await Promise.all(scorePromises);
                    let scores = {};
                    scoresArray.forEach(({ name, score }) => {
                        if (score !== null) { // Only add scores that were successfully fetched
                            scores[name] = score;
                        }
                    });
                    setSafetyScores(scores);
                    saveScoresToStorage(scores);
                } catch (error) {
                    console.error("Failed to fetch safety scores:", error);
                }
            }
        };

        fetchSafetyScores();
    }, []);



    const markers = Object.entries(neighborhoodMapping).map(([name, number]) => {
        const feature = neighborhoodsData.features.find(f => f.properties.NHD_NUM === number);
        if (!feature) return null;

        const outerBoundary = feature.geometry.coordinates[0];
        const centroid = calculateCentroid(outerBoundary);
        const score = safetyScores[name];
        const safetyInfo = score ? `Score: ${score[0]}` : 'Loading...';

        return (
            <Marker
                key={number.toString()}
                coordinate={{ latitude: centroid[1], longitude: centroid[0] }}
                title={name}
                description={safetyInfo}
                pinColor={getMarkerColor(score ? score[0] : undefined)} // Use the function to determine color

            >
            </Marker>
        );
    }).filter(marker => marker !== null);

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

    return (
            <View style={styles.container}>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={{
                        latitude: 38.627003,
                        longitude: -90.236402,
                        latitudeDelta: 0.12,
                        longitudeDelta: 0.12,
                    }}
                >
                    <Geojson geojson={neighborhoodsData} strokeWidth={2} strokeColor="red" />
                    {markers}
                    {userLocation && (
                        <Marker
                            coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
                            title={"Your Location"}
                        >
                            <Image
                                source={userLocationImage}
                                style={{ width: 50, height: 50 }}
                            />
                        </Marker>
                    )}
                </MapView>
            </View>
    );
};

export default MapScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});
