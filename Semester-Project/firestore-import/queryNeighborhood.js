import firebase from 'firebase/app';
import 'firebase/firestore';
import { neighborhoodPopulation, neighborhoodMapping } from './stldata';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKv425wCwtyWhmEXq1kUzQwRfdliulAQc",
  authDomain: "safecities-773a7.firebaseapp.com",
  projectId: "safecities-773a7",
  storageBucket: "safecities-773a7.appspot.com",
  messagingSenderId: "558662647206",
  appId: "1:558662647206:web:12abdfe26185fcd2c0e367",
  measurementId: "G-JXT30DNE87"
};



async function countDocumentsByNeighborhood(neighborhood) {
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const nationalAverage = 1620;
  const stlCrimeRef = db.collection('stl_crime');
  const neighborhoodNumber = neighborhoodMapping[neighborhood];
  const neighborhoodPop = neighborhoodPopulation[neighborhood];
  console.log(neighborhoodNumber);

  const query = stlCrimeRef.where('neighborhood', '==', String(neighborhoodNumber));

  try {
    const snapshot = await query.get();
    console.log(`Found ${snapshot.size} documents with neighborhood ${neighborhoodNumber}.`);
    return Math.floor((snapshot.size * 100000 / neighborhoodPop) / nationalAverage) * 100;
  } catch (error) {
    console.error("Error executing query: ", error);
    throw error;
  }
}

// Example usage
countDocumentsByNeighborhood('Skinker DeBaliviere').then(count => {
  console.log(`The crime rate is ${count}% for that neighborhood.`);
}).catch(error => {
  console.error("Failed to count documents: ", error);
});

module.exports = countDocumentsByNeighborhood;