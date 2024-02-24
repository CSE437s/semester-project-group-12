import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import countDocumentsByNeighborhood from './GetScore';

const ScoreScreen = ({ navigation, route }) => {
    const [count, setCount] = useState(null); // Initialize count state with null
    const neighborhood = route.params?.name.replace(' Neighborhood', '');

    useEffect(() => {
        countDocumentsByNeighborhood(neighborhood)
            .then(fetchedCount => {
                console.log(`The crime index is ${fetchedCount} for that neighborhood.`);
                setCount(fetchedCount); // Update the count state with the fetched value
            })
            .catch(error => {
                console.error("Failed to count documents: ", error);
            });
    }, [neighborhood]); // Depend on neighborhood to re-fetch if it changes

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={[styles.centeredText, styles.titleStyle]}>{neighborhood}</Text>
                <View style={styles.borderBox}>
                    {/* Dynamically display the count value */}
                    <Text style={[styles.centeredText, styles.scoreStyle]}>{count !== null ? count : 'Loading...'}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default ScoreScreen;

// Add your StyleSheet code here


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#26A65B',
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
    // Green: #26A65B, Yellow, #fff321, Red: #d7481d
    borderBox: {
        
        backgroundColor: '#26A65B',
        borderWidth: 4,
        borderColor: 'white',
        borderRadius: 70,
        paddingVertical: 40,
        paddingHorizontal: 30,
        marginVertical: 15,
        marginBottom: 350,
    },
});