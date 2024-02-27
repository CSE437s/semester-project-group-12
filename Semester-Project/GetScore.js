import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { neighborhoodPopulation, neighborhoodMapping } from './stldata';

async function countDocumentsByNeighborhood(neighborhood) {
    const nationalAverage = 1620;
    const stlCrimeCollection = collection(db, 'stl_crime_counts');
    const neighborhoodNumber = neighborhoodMapping[neighborhood];
    const neighborhoodPop = neighborhoodPopulation[neighborhood];

    
    const q = query(stlCrimeCollection, where('neighborhood', '==', String(neighborhoodNumber)));
  
    try {
        const querySnapshot = await getDocs(q);
        const documentData = querySnapshot.docs[0].data()
        console.log(documentData)
        console.log(`Found ${documentData.count} documents with neighborhood ${neighborhoodNumber}.`);
      return Math.floor((documentData.count * 100000 / neighborhoodPop) / nationalAverage * 10);
    } catch (error) {
      console.error("Error executing query: ", error);
      throw error;
    }
  }
// Call the function
export default countDocumentsByNeighborhood;

