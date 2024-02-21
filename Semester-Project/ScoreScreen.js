import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import countDocumentsByNeighborhood from './GetScore';


const ScoreScreen = ({ navigation, route }) => {
    countDocumentsByNeighborhood('Skinker DeBaliviere').then(count => {
        console.log(`The crime rate is ${count}% for that neighborhood.`);
      }).catch(error => {
        console.error("Failed to count documents: ", error);
      });  

      return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={[styles.centeredText, styles.titleStyle]}>{}</Text>
                <View style={styles.borderBox}>
                    <Text style={[styles.centeredText, styles.scoreStyle]}>100</Text>
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
});