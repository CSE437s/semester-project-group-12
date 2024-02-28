import { collection, doc, getDocs, query, setDoc, updateDoc, where, getDoc } from 'firebase/firestore';
import { db } from "./firebaseConfig";

async function addNeighborhood(userid, neighborhood, count) {
    const usersNeighborhoods = collection(db, 'users_neighborhoods');
    const userDocRef = doc(usersNeighborhoods, userid);

    try {
        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
            const existingData = docSnapshot.data();
            const existingNeighborhoods = existingData.neighborhoods || [];

            const existingNeighborhoodIndex = existingNeighborhoods.findIndex(item => item.neighborhood === neighborhood);

            if (existingNeighborhoodIndex !== -1) {
                existingNeighborhoods[existingNeighborhoodIndex].count = count;
            } else {
                // Neighborhood doesn't exist, add it to the array
                existingNeighborhoods.push({ neighborhood, count });
            }

            await updateDoc(userDocRef, { neighborhoods: existingNeighborhoods });
        } else {
            // User document doesn't exist, create a new one
            await setDoc(userDocRef, { neighborhoods: [{ neighborhood, count }] });
        }

        console.log('Neighborhood added/updated successfully.');
    } catch (error) {
        console.error('Error executing query: ', error);
        throw error;
    }
}

async function deleteNeighborhood(userid, neighborhood) {
    const usersNeighborhoods = collection(db, 'users_neighborhoods');
    const userDocRef = doc(usersNeighborhoods, userid);

    try {
        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
            const existingData = docSnapshot.data();
            const existingNeighborhoods = existingData.neighborhoods || [];

            const existingNeighborhoodIndex = existingNeighborhoods.findIndex(item => item.neighborhood === neighborhood);

            if (existingNeighborhoodIndex !== -1) {
                existingNeighborhoods.splice(existingNeighborhoodIndex, 1);

                await updateDoc(userDocRef, { neighborhoods: existingNeighborhoods });

                console.log('Neighborhood deleted successfully.');
            } else {
                console.log('Neighborhood not found for deletion.');
            }
        } else {
            console.log('User document not found for deletion.');
        }
    } catch (error) {
        console.error('Error executing query: ', error);
        throw error;
    }
}

async function getAllNeighborhoods(userid) {
    const usersNeighborhoods = collection(db, 'users_neighborhoods');
    const userDocRef = doc(usersNeighborhoods, userid);

    try {
        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
            const existingData = docSnapshot.data();
            const existingNeighborhoods = existingData.neighborhoods || [];

            // Transform the array into a map {Neighborhood_name: count}
            const neighborhoodsMap = existingNeighborhoods.reduce((map, item) => {
                map[item.neighborhood] = item.count;
                return map;
            }, {});

            return neighborhoodsMap;
        } else {
            console.log('User document not found.');
            return null; // or you can return an empty map {}
        }
    } catch (error) {
        console.error('Error executing query: ', error);
        throw error;
    }
}

export { addNeighborhood, deleteNeighborhood, getAllNeighborhoods };