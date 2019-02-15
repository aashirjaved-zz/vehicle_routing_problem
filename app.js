const dataSet = {
    "Passengers": [{
            "PassengerId": 1,
            "Lat": 33.664826,
            "Long": 73.065371
        },
        {
            "PassengerId": 2,
            "Lat": 33.670181,
            "Long": 73.063589
        },
        {
            "PassengerId": 3,
            "Lat": 33.663152,
            "Long": 73.076959
        },
        {
            "PassengerId": 4,
            "Lat": 33.669514,
            "Long":72.989343
        },
        {
            "PassengerId": 5,
            "Lat": 33.671604,
            "Long": 72.992541
        },
        {
            "PassengerId": 6,
            "Lat": 33.129651,
            "Long": 73.692124
        },
        {
            "PassengerId": 7,
            "Lat": 33.649913,
            "Long": 73.043938
        },
        {
            "PassengerId": 8,
            "Lat": 33.645992,
            "Long": 73.036316
        },
        {
            "PassengerId": 9,
            "Lat": 33.640917,
            "Long": 73.025848
        }

    ],
    "ETD": "14:40",
    "ETA": "08:00",
    "Stations": [{
            "StationId": 1,
            "Lat": 33.668565,
            "Long": 73.071782
        },
        {
            "StationId": 2,
            "Lat": 33.681344,
            "Long": 73.018948
        },
        {
            "StationId": 3,
            "Lat": 33.695300,
            "Long":  72.979676
        }
    ],
    "MaxDistanceFromStation": "500.00",
    "Vehicles": [{
            "VehicleId": 1,
            "MinPassengersNum": 1,
            "MaxPassengersNum": 8,
            "BasicPrice": 100,
            "MaxMinutes": 20,
            "MaxKilo": 8,
            "PriceForAdtKilo": 3,
            "PriceForAdtMinutes": 2
        },
        {
            "VehicleId": 2,
            "MinPassengersNum": 8,
            "MaxPassengersNum": 14,
            "BasicPrice": 120,
            "MaxMinutes": 20,
            "MaxKilo": 8,
            "PriceForAdtKilo": 4,
            "PriceForAdtMinutes": 3
        }
    ],
    "DistLat": 31.01123,
    "DistLong": 32.87623
}

var geoPoint = require('geopoint')
var distance = require('google-distance');
var node_or_tools = require('node_or_tools')



function arePointsNear(checkPoint, centerPoint, km) {
    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return Math.sqrt(dx * dx + dy * dy) <= km;
}

//Allotting stations to passengers 
employeeAllotedStation = [];
for (employee in dataSet.Passengers) {
    let smallestDistance = {
        stationId: "None",
        distance: dataSet.MaxDistanceFromStation
    };
    for (stations in dataSet.Stations) {
        let employePoint = new geoPoint(dataSet.Passengers[employee].Lat, dataSet.Passengers[employee].Long);
        let stationPoint = new geoPoint(dataSet.Stations[stations].Lat, dataSet.Stations[stations].Long)
        var distanceFromStation = employePoint.distanceTo(stationPoint, true)
        if (smallestDistance.distance > distanceFromStation) {
            smallestDistance.stationId = dataSet.Stations[stations].StationId;
            smallestDistance.distance = distanceFromStation
        }
    }
    employeeAllotedStation.push({
        passengerId: dataSet.Passengers[employee].PassengerId,
        stationAlloted: smallestDistance.stationId,
        distance: smallestDistance.distance
    })
}
//console.log(employeeAllotedStation)


//finding nearby stations 
for (stations in dataSet.Stations) {
    var station1 = {lat: dataSet.Stations[stations].Lat, lng:dataSet.Stations[stations].Long}
    for (allStations in dataSet.Stations) {
        if(dataSet.Stations[stations].StationId===dataSet.Stations[allStations].StationId){
            //do nothing
        } else{
            var station2 =  {lat: dataSet.Stations[allStations].Lat, lng:dataSet.Stations[allStations].Long}
            var n = arePointsNear(station1, station2, 5);
            if(n){
                console.log(dataSet.Stations[stations].StationId)
                console.log(dataSet.Stations[allStations].StationId)
            }
        }
    }
}