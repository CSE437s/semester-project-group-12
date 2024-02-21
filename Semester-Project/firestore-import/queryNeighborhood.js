import firebase from 'firebase/app';
import 'firebase/firestore';
import { neighborhoodPopulation, neighborhoodMapping } from './stldata';

// Firebase configuration
const firebaseConfig = {
  // Your Firebase config object
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const nationalAverage = 1620;

async function countDocumentsByNeighborhood(neighborhood) {
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
