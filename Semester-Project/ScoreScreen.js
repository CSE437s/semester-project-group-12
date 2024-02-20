import { StyleSheet, View, Text, SafeAreaView, FlatList, TouchableOpacity, Button } from 'react-native';



const ScoreScreen = ({ navigation, route }) => {
    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Text style={styles.centeredText}>{route.params.name}</Text>
                <Text style={styles.centeredText}>0</Text>
            </View>
           
        </SafeAreaView>

    );
}

export default ScoreScreen;


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        flexDirection: 'col',

    },
    centeredText: {
        textAlign: 'center', 
        // textAlignVertical: 'center', 
      },

});