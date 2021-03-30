var collisionsByLocation = "https://services.arcgis.com/G6F8XLCl5KtAlZ2G/arcgis/rest/services/Traffic_Collisions_by_Location_2015_to_2019/FeatureServer/0/query?where=1%3D1&outFields=Location,Total_Collisions,F2016_Total,F2017_Total,F2018_Total,F2019_Total,Total_Pedestrians,F2015_Pedestrians,F2016_Pedestrians,F2017_Pedestrians,F2018_Pedestrians,F2019_Pedestrians,F2015_Total&outSR=4326&f=json"
var intersectionVolume = "https://services.arcgis.com/G6F8XLCl5KtAlZ2G/arcgis/rest/services/Transportation_Intersection_Volumes_2019/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"
var tabularCollisionData = "https://services.arcgis.com/G6F8XLCl5KtAlZ2G/arcgis/rest/services/2019_Tabular_Transportation_Collision_Data/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"

var streetOne = $("#intersectionOne");
var streetTwo = $("#intersectionTwo");
var submit = $("#submit");

submit.on("click", function (event) {
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
        console.log(data)
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].features.length; j++) {
                // console.log(data[0].features[j].attributes)
                if (data[2].features[j].attributes.Location.toLowerCase().includes(streetOne.val().toLowerCase()) &&
                data[2].features[j].attributes.Location.toLowerCase().includes(streetTwo.val().toLowerCase())) {
                    console.log(data[i].features[j].attributes)
                }; 
            };
        };
    })
});