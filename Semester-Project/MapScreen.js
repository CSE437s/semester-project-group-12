import React from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity  } from 'react-native';
import MapView, { Geojson, Marker } from 'react-native-maps';
import { neighborhoodMapping } from './stldata';
import neighborhoodsData from './neighborhoods.json'


const MapScreen = ({ navigation }) => {
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

        // Assuming the first set of coordinates is the outer boundary of the polygon
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
                    style={styles.map}
                    initialRegion={{
                        latitude: 38.6270,
                        longitude: -90.1994,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1,
                    }}
                >
                    <Geojson geojson={neighborhoodsData} strokeWidth={2} strokeColor="red" />
                    {markers}
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
