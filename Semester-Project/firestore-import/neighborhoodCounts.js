const admin = require('firebase-admin');
const serviceAccount = require('./key.json');
// Get a reference to the Firestore service
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Assuming Firebase has been added and initialized in your project


async function uploadNeighborhoodCounts() {
    // Object to hold neighborhood counts
    const neighborhoodCounts = {};

    // Query all documents in the 'stl_crime' collection
    const snapshot = await db.collection('stl_crime').get();

    // Count occurrences of each neighborhood
    snapshot.forEach(doc => {
        const neighborhood = doc.data().neighborhood; // Assuming 'neighborhood' is the field name
        if (neighborhood in neighborhoodCounts) {
            neighborhoodCounts[neighborhood]++;
        } else {
            neighborhoodCounts[neighborhood] = 1;
        }
    });

    // Upload counts to 'stl_crime_counts' collection, with each neighborhood as a document
    const promises = [];
    Object.keys(neighborhoodCounts).forEach(neighborhood => {
        // Using the neighborhood name as a unique identifier for the document
        const docRef = db.collection('stl_crime_counts').doc(neighborhood);
        const promise = docRef.set({ neighborhood: neighborhood, count: neighborhoodCounts[neighborhood] });
        promises.push(promise);
    });

    // Wait for all writes to complete
    await Promise.all(promises);
    console.log('Neighborhood counts uploaded successfully.');
}

// Call the function to start the process
uploadNeighborhoodCounts().catch(console.error);
