import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { neighborhoodPopulation, neighborhoodMapping } from './stldata';

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

    let score = Math.round(zscoreToPercentile(((documentData.count * 1000 / neighborhoodPop) - 139.40134) / 314.7333));

    const stl = (documentData.count / neighborhoodPop) * (100000 / 3)

    let ratio = stl / 2324;
    if (ratio > 1) {
      ratio = -(ratio - 1) * 100;
    } else {
      ratio = (1 - ratio) * 100;
    }
    console.log("Ratio: " + ratio);

    return [score, ratio];

  } catch (error) {
    console.error("Error executing query: ", error);
    throw error;
  }
}
// Call the function
export default countDocumentsByNeighborhood;

