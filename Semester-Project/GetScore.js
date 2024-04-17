import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { neighborhoodPopulation as neighborhoodPopulationSTL, neighborhoodMapping as neighborhoodMappingSTL } from './stldata';
import { neighborhoodPopulation as neighborhoodPopulationChicago, neighborhoodMapping as neighborhoodMappingChicago } from './chicagoData';


function zscoreToPercentile(z) {
  // Error function approximation
  var erf = function (x) {
    var a1 = 0.254829592,
      a2 = -0.284496736,
      a3 = 1.421413741,
      a4 = -1.453152027,
      a5 = 1.061405429,
      p = 0.3275911;
    var sign = 1;
    if (x < 0)
      sign = -1;
    x = Math.abs(x);

    // A&S formula 7.1.26
    var t = 1.0 / (1.0 + p * x);
    var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  };

  // CDF of standard normal distribution
  var cdf = function (x) {
    return 0.5 * (1 + erf(x / Math.sqrt(2)));
  };

  // Convert z-score to percentile
  var percentile = cdf(z) * 100;
  return percentile;
}

async function countDocumentsByNeighborhood(neighborhood, location = 'STL') {
    let crimeCollectionName, neighborhoodMapping, neighborhoodPopulation, queryField;

    if (location === 'STL') {
        crimeCollectionName = 'stl_crime_counts';
        neighborhoodMapping = neighborhoodMappingSTL;
        neighborhoodPopulation = neighborhoodPopulationSTL;
        queryField = 'neighborhood'; // Query field for STL
    } else if (location === 'Chicago') {
        crimeCollectionName = 'chicago_crime_counts';
        neighborhoodMapping = neighborhoodMappingChicago;
        neighborhoodPopulation = neighborhoodPopulationChicago;
        queryField = 'communityArea'; // Query field for Chicago
    } else {
        throw new Error("Invalid location specified");
    }

    const nationalAverage = 1620; // Assuming this remains constant across locations
    const crimeCollection = collection(db, crimeCollectionName);
    const neighborhoodNumber = neighborhoodMapping[neighborhood];
    const neighborhoodPop = neighborhoodPopulation[neighborhood];

    const q = query(crimeCollection, where(queryField, '==', String(neighborhoodNumber)));

    try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length > 0) {
            const documentData = querySnapshot.docs[0].data();
            console.log(`Found ${documentData.count} documents with ${queryField} ${neighborhoodNumber}.`);
            let score;
            if (location === 'STL') {
                score = Math.
                round(zscoreToPercentile(((documentData.count / neighborhoodPop) - (139.40134 / 3388)) / (314.7333 / 3388)));
            }
            else {
                score = Math.round(zscoreToPercentile(((documentData.count / neighborhoodPop) - (584.415584 / 35667)) / (464.6418 / 35667)));
                console.log(documentData.count)
                console.log(neighborhoodPop)
                console.log(score)
            }
            const ratio = calculateCrimeRatio(documentData.count, neighborhoodPop);

            console.log("Ratio: " + ratio);

            return [score, ratio];
        } else {
            console.log(`No documents found for the specified ${queryField}.`);
            return [0, 0];
        }
    } catch (error) {
        console.error("Error executing query: ", error);
        throw error;
    }
}

function calculateCrimeRatio(crimeCount, neighborhoodPop) {
    const ratioValue = (crimeCount / neighborhoodPop) * (100000 / 3);
    let ratio = ratioValue / 2324;
    if (ratio > 1) {
        ratio = -(ratio - 1) * 100;
    } else {
        ratio = (1 - ratio) * 100;
    }
    return ratio;
}
// Call the function
export default countDocumentsByNeighborhood;

