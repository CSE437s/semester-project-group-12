import {React, useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { auth } from './firebaseConfig';
import countDocumentsByNeighborhood from './GetScore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const user = auth.currentUser;
let userid;

if (user) {
    userid = user.uid;
    console.log('User ID:', userid);
} 

const ScoreScreen = ({ navigation, route }) => {
    const [count, setCount] = useState(null); // Initialize count state with null
    const neighborhood = route.params?.name.replace(' Neighborhood', '');
    const [neighborhoods, setNeighborhoods] = useState({});


    useEffect(() => {
        countDocumentsByNeighborhood(neighborhood)
            .then(fetchedCount => {
                console.log(`The crime index is ${fetchedCount} for that neighborhood.`);
                setCount(fetchedCount); // Update the count state with the fetched value
            })
            .catch(error => {
                console.error("Failed to count documents: ", error);
            });
        loadData();
    }, [neighborhood]); // Depend on neighborhood to re-fetch if it changes

    const saveData = async () => {
        try {
            const updatedArray = {...neighborhoods, [neighborhood]: count};

            await AsyncStorage.setItem('neighborhoods', JSON.stringify(updatedArray));
            console.log('Data saved successfully!');
            loadData();
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const loadData = async () => {
        try {
            const data = await AsyncStorage.getItem('neighborhoods');
            if (data !== null) {
                const parsedData = JSON.parse(data);
                setNeighborhoods(parsedData);
                console.log('Data loaded successfully:', parsedData);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    // const addNeighborhood = () => {
    //     console.log(userid)
    // }
    const getBackgroundColor = () => {
        if (count !== null) {
            if (count > 70) {
                return '#d7481d'; // red
            } else if (count > 40) {
                return '#fff321'; // Yellow
            } else {
                return '#26A65B'; // Red
            }
        } else {
            return '#26A65B'; // Default color when count is null (loading)
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={saveData}>
                <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>
            <View style={styles.innerContainer}>
                <Text style={[styles.centeredText, styles.titleStyle]}>{neighborhood}</Text>
                <View style={[styles.borderBox, { backgroundColor: getBackgroundColor() }]}>
                    {/* Dynamically display the count value */}
                    <Text style={[styles.centeredText, styles.scoreStyle]}>{count !== null ? count : 'Loading...'}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default ScoreScreen;


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