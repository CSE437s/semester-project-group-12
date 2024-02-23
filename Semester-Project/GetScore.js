import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { neighborhoodPopulation, neighborhoodMapping } from './stldata';

async function countDocumentsByNeighborhood(neighborhood) {
    const nationalAverage = 1620;
    const stlCrimeCollection = collection(db, 'stl_crime_counts');
    const neighborhoodNumber = neighborhoodMapping[neighborhood];
    const neighborhoodPop = neighborhoodPopulation[neighborhood];
    console.log(neighborhoodNumber);
    
    const q = query(stlCrimeCollection, where('neighborhood', '==', String(neighborhoodNumber)));
  
    try {
      const querySnapshot = await getDocs(q);
      console.log(`Found ${querySnapshot.size} documents with neighborhood ${neighborhoodNumber}.`);
      
      return Math.floor((querySnapshot.size * 100000 / neighborhoodPop) / nationalAverage) * 100;
    } catch (error) {
      console.error("Error executing query: ", error);
      throw error;
    }
  }
  

// Call the function
export default countDocumentsByNeighborhood;
