import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "./firebaseConfig";

async function addNeighborhood(userid, neighborhood, count) {



    const q = query(stlCrimeCollection, where('neighborhood', '==', String(neighborhoodNumber)));

    try {
        const querySnapshot = await getDocs(q);
        const documentData = querySnapshot.docs[0].data()
        console.log(documentData)
        console.log(`Found ${documentData.count} documents with neighborhood ${neighborhoodNumber}.`);
    } catch (error) {
        console.error("Error executing query: ", error);
        throw error;
    }
}

async function removeNeighborhood(userid, neighborhood) {

    const q = query(stlCrimeCollection, where('neighborhood', '==', String(neighborhoodNumber)));

    try {
        const querySnapshot = await getDocs(q);
        const documentData = querySnapshot.docs[0].data()
        console.log(documentData)
        console.log(`Found ${documentData.count} documents with neighborhood ${neighborhoodNumber}.`);
    } catch (error) {
        console.error("Error executing query: ", error);
        throw error;
    }
}

async function getNeighborhoods(userid) {

    const q = query(stlCrimeCollection, where('neighborhood', '==', String(neighborhoodNumber)));

    try {
        const querySnapshot = await getDocs(q);
        const documentData = querySnapshot.docs[0].data()
        console.log(documentData)
        console.log(`Found ${documentData.count} documents with neighborhood ${neighborhoodNumber}.`);
    } catch (error) {
        console.error("Error executing query: ", error);
        throw error;
    }
}



export default { addNeighborhood, removeNeighborhood, getNeighborhoods };