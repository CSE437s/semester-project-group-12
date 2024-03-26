const geolib = require('geolib');
const neighborhoodsData = require('./neighborhoods.json');

// Function to determine the neighborhood
export function findNeighborhood(longitude, latitude) {
    console.log(`Searching for point: ${latitude}, ${longitude}`);
    for (const feature of neighborhoodsData.features) {
        const polygon = feature.geometry.coordinates[0].map(coord => ({
            longitude: coord[0],
            latitude: coord[1],
        }));

        const isInPolygon = geolib.isPointInPolygon({ longitude, latitude }, polygon);

        if (isInPolygon) {
            console.log(`Point is in: ${feature.properties.NHD_NAME}`);
            return feature.properties.NHD_NAME;
        }
    }
    console.log('Neighborhood not found');
    return null;
}


// Example usage
// const userLongitude = -90.184776; // Example longitude
// const userLatitude = 38.624691;  // Example latitude

// const neighborhood = findNeighborhood(userLongitude, userLatitude, neighborhoodsData);
// console.log(neighborhood);
