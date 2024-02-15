const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const csv = require('csv-parser');
const fs = require('fs');
const results = [];

fs.createReadStream('crimedata2023.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    results.forEach((doc) => {
      db.collection('Stl Crime Data').add(doc)
        .then(() => console.log('Document added'))
        .catch((error) => console.error('Error adding document', error));
    });
  });
