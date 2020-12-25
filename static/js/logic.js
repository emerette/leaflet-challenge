// URL to earthquake json data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// function to determine marker size based on magnitude
function markerSize(magnitude) {
    return magnitude * 6;
}

// function to return the color based on magnitude
function markerColor(magnitude) {
  if (magnitude > 6) {
    return '#416d49'
  } else if (magnitude > 5) {
    return '#33ff66'
  } else if (magnitude > 4) {
    return '#98ff98'
  } else if (magnitude > 3) {
    return '#feff57'
  } else if (magnitude > 2) {
    return '#eebd71'
  } else {
    return '#ffe4e1'
  }
}

function markerOpacity(magnitude) {
  if (magnitude > 6) {
    return 0.9
  } else if (magnitude > 5) {
    return 0.8
  } else if (magnitude > 4) {
    return 0.7
  } else if (magnitude > 3) {
    return 0.6
  } else if (magnitude > 2) {
    return 0.5
  } else if (magnitude > 1) {
    return 0.4
  } else {
    return 0.3
  }
}

// GET request, and function to handle returned JSON data
d3.json(queryUrl, function(data) {
  
  var earthquakes = L.geoJSON(data.features, {
    onEachFeature : addPopup,
    pointToLayer: addMarker
  });

// call function to create map
  createMap(earthquakes);

});

function addMarker(feature, location) {
  var options = {
    stroke: false,
    color: markerColor(feature.properties.mag),
    fillColor: markerColor(feature.properties.mag),
    fillOpacity: markerOpacity(feature.properties.mag),
    radius: markerSize(feature.properties.mag)
  }

  return L.circleMarker(location, options);

}

// Define a function we want to run once for each feature in the features array
function addPopup(feature, layer) {
    // Give each feature a popup describing the place and time of the earthquake
    return layer.bindPopup(`<h3> ${feature.properties.place} </h3> <hr> <h4>Magnitude: ${feature.properties.mag} </h4> <p> ${Date(feature.properties.time)} </p>`);
}

// function to receive a layer of markers and plot them on a map.
function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 13,
      zoomOffset: -1,
      id: "mapbox/light-v10",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
  
    // creating the legend
    var legend = L.control({position: 'bottomright'});

    // add legend to map
    legend.onAdd = function (myMap) {
    
      var div = L.DomUtil.create('div', 'legend');
      
      div.innerHTML += '<i style="background: #ffe4e1"></i><span>-10~10</span><br>';
      div.innerHTML += '<i style="background: #eebd71"></i><span>10~30</span><br>';
      div.innerHTML += '<i style="background: #feff57"></i><span>30~50</span><br>';
      div.innerHTML += '<i style="background: #98ff98"></i><span>50~70</span><br>';
      div.innerHTML += '<i style="background: #33ff66"></i><span>70~90</span><br>';
      div.innerHTML += '<i style="background: #416d49"></i><span>90~</span><br>';
    

    return div;
    };
    
    legend.addTo(myMap);

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

  }