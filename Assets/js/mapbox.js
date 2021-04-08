var start = [];
var end = [];
var startLocation;
var endLocation;

var submit = $("#search");
var image = $("#image");
var ranking = $("#ranking");
var mapboxglaccessToken = 'pk.eyJ1Ijoid2luZ2VoIiwiYSI6ImNrbXMwYnZxaTBjcXkybm14enczN281ZXEifQ.bsBm9JlGjhos_-74rAL1uA';

// listen for click event
submit.on("click", function (event) {

event.preventDefault();

var startLocation = document.getElementById("street1").value;
var endLocation = document.getElementById("street2").value;

//collect starting and ending point, codify user inputer, form API request
var geocodingStart = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + startLocation.replace(/ /g, '%20') + '.json?proximity=-75.699234,45.424807&access_token=' + mapboxglaccessToken;
var geocodingEnd = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + endLocation.replace(/ /g, '%20') + '.json?proximity=-75.699234,45.424807&access_token=' + mapboxglaccessToken;

//get start and end location coordinates
Promise.all ([
    fetch(geocodingStart),
	fetch(geocodingEnd),
])
.then (function (responses) {
    return Promise.all(responses.map(function (response) {
    return response.json();
    }));   
})
.then (function (data) {
		var start = [data[0].features[0].center[0], data[0].features[0].center[1]];
		

		var end = [data[1].features[0].center[0], data[1].features[0].center[1]];
		
		
		getRoute (start, end);
	});


// create a function to make a directions request
function getRoute(start, end) {
	
  // make a directions request using driving+traffic profile  
  var url = 'https://api.mapbox.com/directions/v5/mapbox/driving-traffic/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken;
  var collisionsByLocation = "https://services.arcgis.com/G6F8XLCl5KtAlZ2G/arcgis/rest/services/Traffic_Collisions_by_Location_2015_to_2019/FeatureServer/0/query?where=1%3D1&outFields=Location,Total_Collisions,F2016_Total,F2017_Total,F2018_Total,F2019_Total,Total_Pedestrians,F2015_Pedestrians,F2016_Pedestrians,F2017_Pedestrians,F2018_Pedestrians,F2019_Pedestrians,F2015_Total&outSR=4326&f=json"
  var intersectionVolume = "https://services.arcgis.com/G6F8XLCl5KtAlZ2G/arcgis/rest/services/Transportation_Intersection_Volumes_2019/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"
  var tabularCollisionData = "https://services.arcgis.com/G6F8XLCl5KtAlZ2G/arcgis/rest/services/2019_Tabular_Transportation_Collision_Data/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"

  // make an XHR request https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
  var req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.onload = function() {
	var json = JSON.parse(req.response);
	var data = json.routes[0];
	var route = data.geometry.coordinates;
	var geojson = {
	  type: 'Feature',
	  properties: {},
	  geometry: {
		type: 'LineString',
		coordinates: route
	  }
	};
	var intersectionArr = [];

for (var i = 0; i < data.legs[0].steps.length; i++) {
  var rounded = math.round(data.legs[0].steps[i].intersections[0].location, 3);
  intersectionArr.push(rounded.toString());
};

Promise.all ([
	fetch(collisionsByLocation), 
	fetch(intersectionVolume), 
	fetch(tabularCollisionData) 
])
.then (function (responses) {
	return Promise.all(responses.map(function (response) {
	return response.json();
	}));   
})
.then (function (data) {

	var totalIntersectionArr = [];
	
	for (var i = 0; i < data.length; i++) {
		for (var j = 0; j < data[i].features.length; j++) {
		  var crashIntersectionArr = math.round(Object.values(data[i].features[j].geometry), 3);
		  totalIntersectionArr.push(crashIntersectionArr.toString());    
		};
	};
	
	var crashesOnRouteArr = [];
	
	for (var i = 0; i <intersectionArr.length; i++) {
	  for (var j = 0; j< totalIntersectionArr.length; j++) {
		if (intersectionArr[i] === totalIntersectionArr[j]) {
		  crashesOnRouteArr.push(totalIntersectionArr[j]); 
		}; 
	  };
	};
	
	var counterArr = [];
	
	for (var i = 0; i <crashesOnRouteArr.length; i++) {
	  for (var j = 0; j < data.length; j++) {
		for (var k = 0; k < data[j].features.length; k++) {
		  var coordinates = math.round(Object.values(data[j].features[k].geometry), 3).toString();
		  if (crashesOnRouteArr[i] === coordinates) {
			if (data[j].features[k].attributes.Location !== undefined) {
			  counterArr.push(data[j].features[k].attributes.Location);
			};
		  }; 
		};
	  }; 
	};
	
	var uniqueCounterArr = [... new Set(counterArr)];
	
	if (uniqueCounterArr.length >= 6) {
	  image.css("display", "inline");
	  image.attr("src", "https://upload.wikimedia.org/wikipedia/commons/e/e6/Kim_Kardashian_2019.jpg");
	  ranking.text("Your route is a Kim. Take necessary precautions.");
	   
	} else if (uniqueCounterArr.length >= 4) {
	  image.css("display", "inline");
	  image.attr("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Khloe_Kardashian_Glamour_2.png/220px-Khloe_Kardashian_Glamour_2.png");
	  ranking.text("Your route is a Khloe. Relatively safe.");
	 
	} else if (uniqueCounterArr.length >= 2) {
	  image.css("display", "inline");
	  image.attr("src", "https://upload.wikimedia.org/wikipedia/commons/1/1a/Kourtney_Kardashian_2_2009.jpg");
	  ranking.text("Your route is a Kourtney. It's very safe");
	  
	}  else  {
	  image.css("display", "inline");
	  image.attr("src", "http://www.gstatic.com/tv/thumb/persons/616912/616912_v9_ba.jpg");
	  ranking.text("Your route is a Rob. No problems here!");
	};
});

	// if the route already exists on the map, reset it using setData
	if (map.getSource('route')) {
	  map.getSource('route').setData(geojson);
	} else { // otherwise, make a new request
	  map.addLayer({
		id: 'route',
		type: 'line',
		source: {
		  type: 'geojson',
		  data: {
			type: 'Feature',
			properties: {},
			geometry: {
			  type: 'LineString',
			  coordinates: geojson
			}
		  }
		},
		layout: {
		  'line-join': 'round',
		  'line-cap': 'round'
		},
		paint: {
		  'line-color': '#3887be',
		  'line-width': 5,
		  'line-opacity': 0.75
		}
	  });
	}
	// add turn instructions here at the end
			// get the sidebar and add the instructions
			var instructions = document.getElementById('instructions');
  var steps = data.legs[0].steps;
  
  var tripInstructions = [];
  for (var i = 0; i < steps.length; i++) {
  tripInstructions.push('<br><li>' + steps[i].maneuver.instruction) + '</li>';
  instructions.innerHTML = '<br><span class="duration">Trip duration: ' + Math.floor(data.duration / 60) + ' min </span>' + tripInstructions;
  };
  };
  req.send();
  }
});

