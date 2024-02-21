const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// anotherFile.js
const { neighborhoodPopulation, neighborhoodMapping } = require('./stldata.js');



// Initialize Firestore
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

/**
 * Count the number of documents in the 'stl_crime' collection where the 'neighborhood' field
 * matches the provided neighborhood number.
 * @param {string} neighborhoodNumber The neighborhood number to query for.
 * @returns {Promise<number>} A promise that resolves to the count of matching documents.
 */
function countDocumentsByNeighborhood(neighborhood) {
    const stlCrimeRef = db.collection('stl_crime');
    
    const neighborhoodNumber = neighborhoodMapping[neighborhood]
    const neighborhoodPop = neighborhoodPopulation[neighborhood]
    console.log(neighborhoodNumber)
    const query = stlCrimeRef.where('neighborhood', '==', String(neighborhoodNumber));
    
    return  query.get().then(snapshot => {
      console.log(`Found ${snapshot.size} documents with neighborhood ${neighborhoodNumber}.`);
      return snapshot.size / neighborhoodPop; 
    }).catch(error => {
      console.error("Error executing query: ", error);
      throw error; 
    });
  }
  
  countDocumentsByNeighborhood('Skinker DeBaliviere').then(count => {
    console.log(`There are ${count} crimes reported in that neighborhood.`);
  }).catch(error => {
    // Handle any errors that occur during the query
    console.error("Failed to count documents: ", error);
  });

