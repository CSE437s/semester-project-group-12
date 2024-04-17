import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import MapView, { Geojson, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import countDocumentsByNeighborhood from './GetScore';
import { neighborhoodMapping as neighborhoodMappingSTL } from './stldata';
import { neighborhoodMapping as neighborhoodMappingChicago } from './chicagoData';
import chicagoNeighborhoodsData from './chicagoCoordinates.json';
import neighborhoodsData from './neighborhoods.json';
import userLocationImage from './userLocation.png';
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
        if (scoreNum > 80) return 'red';
        if (scoreNum > 50) return 'yellow';
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

    useEffect(() => {
        const fetchSafetyScores = async () => {
            const storedScoresData = await loadScoresFromStorage();
            const oneDay = 24 * 60 * 60 * 1000; // Time in milliseconds
            if (storedScoresData && new Date().getTime() - storedScoresData.timestamp < oneDay) {
                setSafetyScores(storedScoresData.scores);
            } else {
                const stlScorePromises = Object.keys(neighborhoodMappingSTL).map(name =>
                    countDocumentsByNeighborhood(name, 'STL').then(score => ({ name, score }))
                        .catch(error => {
                            console.error(`Failed to fetch score for ${name}:`, error);
                            return { name, score: null };
                        })
                );

                const chicagoScorePromises = Object.keys(neighborhoodMappingChicago).map(name =>
                    countDocumentsByNeighborhood(name, 'Chicago').then(score => ({ name, score }))
                        .catch(error => {
                            console.error(`Failed to fetch score for ${name}:`, error);
                            return { name, score: null };
                        })
                );

                const scoresArray = await Promise.all([...stlScorePromises, ...chicagoScorePromises]);
                let scores = {};
                scoresArray.forEach(({ name, score }) => {
                    scores[name] = score; // Update to handle null scores appropriately
                });
                setSafetyScores(scores);
                saveScoresToStorage(scores);
            }
        };

        fetchSafetyScores();
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

    const createMarkers = (neighborhoodData, mapping, city) => {
        return Object.entries(mapping).map(([name, number]) => {
            let feature;
            if (city == 'STL') {
                feature = neighborhoodData.features.find(f => f.properties.NHD_NUM === number);
            } else {
                feature = neighborhoodData.features.find(f => {
                    return Number(f.properties.area_numbe) === number;
                });
            }

            if (!feature) {
                console.log(`No feature found for ${name} in ${city} with ID ${number}`);
                return null;
            }


            // Adjust the way you access coordinates based on whether the data uses Polygon or MultiPolygon
            const outerBoundary = (feature.geometry.type === "MultiPolygon")
                ? feature.geometry.coordinates[0][0] // Assuming the first polygon if multiple
                : feature.geometry.coordinates[0];

            const centroid = calculateCentroid(outerBoundary);

            const score = safetyScores[name];
            const safetyInfo = score ? `Score: ${score[0]}` : 'Loading...';

            return (
                <Marker
                    key={number.toString()}
                    coordinate={{ latitude: centroid[1], longitude: centroid[0] }}
                    title={name}
                    description={safetyInfo}
                    pinColor={getMarkerColor(score ? score[0] : undefined)}
                />
            );
        }).filter(marker => marker !== null);
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


    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: lat,
                    longitude: long,
                    latitudeDelta: 0.12,
                    longitudeDelta: 0.12,
                }}
            >
                <Geojson geojson={neighborhoodsData} strokeWidth={2} strokeColor="red" />
                <Geojson geojson={chicagoNeighborhoodsData} strokeWidth={2} strokeColor="red" />
                {createMarkers(neighborhoodsData, neighborhoodMappingSTL, 'STL')}
                {createMarkers(chicagoNeighborhoodsData, neighborhoodMappingChicago, 'Chicago')}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    }
});

export default MapScreen;
