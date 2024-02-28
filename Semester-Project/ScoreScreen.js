import { React, useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { auth } from './firebaseConfig';
import countDocumentsByNeighborhood from './GetScore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addNeighborhood, deleteNeighborhood } from './PersonalData';

const ScoreScreen = ({ navigation, route }) => {
    const [count, setCount] = useState(null);
    const [userid, setUserid] = useState(null);
    const neighborhood = route.params?.name.replace(' Neighborhood', '');
    const [neighborhoods, setNeighborhoods] = useState({});

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setUserid(user.uid);
                console.log('User ID:', user.uid);
            } else {
                setUserid(null);
                console.log('User is signed out');
            }
        });

        return () => unsubscribe(); 
    }, []);
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
            const updatedArray = { ...neighborhoods, [neighborhood]: count };

            await AsyncStorage.setItem('neighborhoods', JSON.stringify(updatedArray));
            await addNeighborhood(userid, neighborhood, count)
            console.log('Data saved successfully!');
            loadData();
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const deleteData = async () => {
        try {
            const updatedObject = { ...neighborhoods } || {};

            if (neighborhood in updatedObject) {
                delete updatedObject[neighborhood];

                await AsyncStorage.setItem('neighborhoods', JSON.stringify(updatedObject));
                await deleteNeighborhood(userid, neighborhood);
                console.log('Data deleted successfully!');
                setNeighborhoods(updatedObject);
            } else {
                console.log(`Neighborhood ${neighborhood} not found in data.`);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
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

    const getBackgroundColor = () => {
        if (count !== null) {
            if (count > 70) {
                return { backgroundColor: '#d7481d', status: 'Dangerous' };
            } else if (count > 40) {
                return { backgroundColor: '#FFBF00', status: 'Fair' };
            } else {
                return { backgroundColor: '#26A65B', status: 'Safe' };
            }
        }
    }  


    return (
        <SafeAreaView style={[styles.container, { backgroundColor: getBackgroundColor()?.backgroundColor }]}>
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            {neighborhood in (neighborhoods || {})
                ?
                (<TouchableOpacity style={styles.addButton} onPress={deleteData}>
                    <Text style={styles.addText}>Remove</Text>
                </TouchableOpacity>)
                :
                (<TouchableOpacity style={styles.addButton} onPress={saveData}>
                    <Text style={styles.addText}>Add</Text>
                </TouchableOpacity>)
            }
    
            <View style={styles.innerContainer}>
                <Text style={[styles.centeredText, styles.titleStyle]}>{neighborhood}</Text>
                <View style={[styles.borderBox, { backgroundColor: getBackgroundColor()?.backgroundColor }]}>
                    {/* Dynamically display the count value */}
                    <Text style={[styles.centeredText, styles.scoreStyle]}>{count !== null ? count : 'Loading...'}</Text>
                </View>
                <Text style={styles.statusText}> Danger Level: {getBackgroundColor()?.status}</Text>
            </View>
        </SafeAreaView>
    );
};

export default ScoreScreen;

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
