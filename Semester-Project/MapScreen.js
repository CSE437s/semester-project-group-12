import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, Image } from 'react-native';
import MapView, { Geojson, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { neighborhoodMapping } from './stldata';
import neighborhoodsData from './neighborhoods.json';
import userLocationImage from './userLocation.png'; 

const MapScreen = ({ navigation }) => {
    const [userLocation, setUserLocation] = useState(null);
    const mapRef = useRef(null);

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
            const storedLocation = await loadLocation();
            if (storedLocation) {
                setUserLocation(storedLocation);
                mapRef.current?.animateToRegion({
                    latitude: storedLocation.latitude,
                    longitude: storedLocation.longitude,
                    latitudeDelta: 0.08,
                    longitudeDelta: 0.08,
                }, 1000);
            } else {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.log("Location permission not granted");
                    return;
                }

                let currentLocation = await Location.getCurrentPositionAsync({});
                setUserLocation(currentLocation.coords);
                saveLocation(currentLocation.coords);

                mapRef.current?.animateToRegion({
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude,
                    latitudeDelta: 0.08,
                    longitudeDelta: 0.08,
                }, 1000);
            }
        })();
    }, []);

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

    const markers = Object.entries(neighborhoodMapping).map(([name, number]) => {
        const feature = neighborhoodsData.features.find(f => f.properties.NHD_NUM === number);
        if (!feature) return null;

        const outerBoundary = feature.geometry.coordinates[0];
        const centroid = calculateCentroid(outerBoundary);

        return (
            <Marker
                key={number.toString()}
                coordinate={{ latitude: centroid[1], longitude: centroid[0] }}
                title={name}
            />
        );
    }).filter(marker => marker !== null);

    return (
        <SafeAreaView style={styles.container}>
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
        </SafeAreaView>
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
