console.log ("mapbox.js called")

var start = [];
var startLocation;
var endLocation;
// var endLocation = $("#endLocation");

var submit = $("#search");

var mapboxglaccessToken = 'pk.eyJ1Ijoid2luZ2VoIiwiYSI6ImNrbXMwYnZxaTBjcXkybm14enczN281ZXEifQ.bsBm9JlGjhos_-74rAL1uA';

// listen for click event
submit.on("click", function (event) {

//prevent refresh
event.preventDefault();

var startLocation = document.getElementById("street1").value;
var endLocation = document.getElementById("street2").value;

//collect starting and ending point, codify user inputer, form API request
var geocodingStart = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + startLocation.replace(/ /g, '%20') + '.json?access_token=' + mapboxglaccessToken;
var geocodingEnd = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + endLocation.replace(/ /g, '%20') + '.json?access_token=' + mapboxglaccessToken;

//get start location coordinates
Promise.all ([
    fetch(geocodingStart), 
])
.then (function (responses) {
    return Promise.all(responses.map(function (response) {
    return response.json();
    }));   
})
.then (function (data) {
		var start = [data[0].features[0].center[0], data[0].features[0].center[1]];
		console.log (start);
	});

//get end location coordinates
Promise.all ([
	fetch(geocodingEnd), 
])
.then (function (responses) {
	return Promise.all(responses.map(function (response) {
	return response.json();
	}));   
})
.then (function (data) {
	var end = [data[0].features[0].center[0], data[0].features[0].center[1]];
	console.log (end);
});

getRoute (start, end);
});

// function getDirections (){

// 	var url = 'https://api.mapbox.com/directions/v5/mapbox/driving-traffic/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken;

// 	  // make an XHR request https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
// 	  var req = new XMLHttpRequest();
// 	  req.open('GET', url, true);
// 	  req.onload = function() {
// 		var json = JSON.parse(req.response);
// 		var data = json.routes[0];
// 		var route = data.geometry.coordinates;
// 		var geojson = {
// 		  type: 'Feature',
// 		  properties: {},
// 		  geometry: {
// 			type: 'LineString',
// 			coordinates: route
// 		  }
// 		};
	
// 		//RYANS KINGDOM START
	
// 		//RYANS KINGDOM END
		
// 		// if the route already exists on the map, reset it using setData
// 		if (map.getSource('route')) {
// 		  map.getSource('route').setData(geojson);
// 		} else { // otherwise, make a new request
// 		  map.addLayer({
// 			id: 'route',
// 			type: 'line',
// 			source: {
// 			  type: 'geojson',
// 			  data: {
// 				type: 'Feature',
// 				properties: {},
// 				geometry: {
// 				  type: 'LineString',
// 				  coordinates: geojson
// 				}
// 			  }
// 			},
// 			layout: {
// 			  'line-join': 'round',
// 			  'line-cap': 'round'
// 			},
// 			paint: {
// 			  'line-color': '#3887be',
// 			  'line-width': 5,
// 			  'line-opacity': 0.75
// 			}
// 		  });
// 		}
// 		// add turn instructions here at the end
// 	  };
// 	  req.send();
// 	};

// 	map-content.on('load', function() {
// 		// make an initial directions request that
// 		// starts and ends at the same location
// 		getRoute(start);
	  
// 		// Add starting point to the map
// 		map.addLayer({
// 		  id: 'point',
// 		  type: 'circle',
// 		  source: {
// 			type: 'geojson',
// 			data: {
// 			  type: 'FeatureCollection',
// 			  features: [{
// 				type: 'Feature',
// 				properties: {},
// 				geometry: {
// 				  type: 'Point',
// 				  coordinates: start
// 				}
// 			  }
// 			  ]
// 			}
// 		  },
// 		  paint: {
// 			'circle-radius': 10,
// 			'circle-color': '#3887be'
// 		  }
// 		});
// 		map.on('click', function(e) {
// 		var coordsObj = e.lngLat;
// 		canvas.style.cursor = '';
// 		var coords = Object.keys(coordsObj).map(function(key) {
// 		  return coordsObj[key];
// 		});
// 		var end = {
// 		  type: 'FeatureCollection',
// 		  features: [{
// 			type: 'Feature',
// 			properties: {},
// 			geometry: {
// 			  type: 'Point',
// 			  coordinates: coords
// 			}
// 		  }
// 		  ]
// 		};
// 		if (map.getLayer('end')) {
// 		  map.getSource('end').setData(end);
// 		} else {
// 		  map.addLayer({
// 			id: 'end',
// 			type: 'circle',
// 			source: {
// 			  type: 'geojson',
// 			  data: {
// 				type: 'FeatureCollection',
// 				features: [{
// 				  type: 'Feature',
// 				  properties: {},
// 				  geometry: {
// 					type: 'Point',
// 					coordinates: coords
// 				  }
// 				}]
// 			  }
// 			},
// 			paint: {
// 			  'circle-radius': 10,
// 			  'circle-color': '#f30'
// 			}
// 		  });
// 		}
// 		getRoute(coords);
// 	  });
// 	  });