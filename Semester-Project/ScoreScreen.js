import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';

const ScoreScreen = ({ navigation, route }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={[styles.centeredText, styles.titleStyle]}>{route.params.name}</Text>
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
        backgroundColor: '#8ecae6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredText: {
        color: "#fff",
        textAlign: 'center',
        fontWeight: 'bold'
    },
    titleStyle: {
        fontSize: 30,
    },
    scoreStyle: {
        fontSize: 35,

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
});