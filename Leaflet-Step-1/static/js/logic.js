//test - worked but can't use APIKEY bc config.js file not being called in properly in index.html
// Store our API endpoint inside queryUrl

function buildUrl(){
    const
        domain = "earthquake.usgs.gov",
        endpoint = "/fdsnws/event/1/query",
        format = "geojson",
        starttime = "2014-01-01",
        endtime = "2014-01-02",
        maxLon = -69.52148437,
        minLon = -123.83789062,
        maxLat = 48.74894534,
        minLat = 25.16517337;

    return `https://${domain}${endpoint}?format=${format}&starttime=${starttime}&endtime=${endtime}&maxlongitude=${maxLon}&minlongitude=${minLon}&maxlatitude=${maxLat}&minlatitude=${minLat}`;
    
}

function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    const earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    const streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.streets",
            // accessToken: APIKEY
            accessToken: "pk.eyJ1IjoibWFubGFyYSIsImEiOiJjamtnd2R3ZW4wbWlwM3FxZ3BoY2JkNm1qIn0.NQ7yhFgYEP0fqdHkT9c6-Q"
    });

    const darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.dark",
            // accessToken: APIKEY
            accessToken: "pk.eyJ1IjoibWFubGFyYSIsImEiOiJjamtnd2R3ZW4wbWlwM3FxZ3BoY2JkNm1qIn0.NQ7yhFgYEP0fqdHkT9c6-Q"
    });

    // Define a baseMaps object to hold our base layers
    const baseMaps = {
            "Street Map": streetmap,
            "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    const overlayMaps = {
            Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    const myMap = L.map("map", {
            center: [37.09, -95.71],
            zoom: 5,
            layers: [streetmap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
    }).addTo(myMap);
}
//choosing color for markers according to richter scale
function chooseColor(earthquakes_mag) {
    if (earthquakes_mag > 2.5){
        return "green"
    }
  
    if (earthquakes_mag > 5.4){
        return "yellow"
    }
  
    if (earthquakes_mag > 6.1){
        return "orange"
    }
  
    if (earthquakes_mag > 6.9){
        return "red"
    }
    if (earthquakes_mag > 7.9){
        return "black"
    }
    
    return "grey"
  }

(async function(){
    const queryUrl = buildUrl();
    const data = await d3.json(queryUrl);
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
})()

