const dataSet = {
    "Passengers": [{
            "PassengerId": 1,
            "Lat": 31.0012,
            "Long": 32.12
        },
        {
            "PassengerId": 2,
            "Lat": 31.99,
            "Long": 32.231
        },
        {
            "PassengerId": 3,
            "Lat": 39.11,
            "Long": 31.01
        },
        {
            "PassengerId": 4,
            "Lat": 30.95,
            "Long": 39.0
        },
        {
            "PassengerId":5,
            "Lat": 21.22,
            "Long":40.3
        }

    ],
    "ETD": "14:40",
    "ETA": "08:00",
    "Stations": [{
            "StationId": 1,
            "Lat": 31.0012,
            "Long": 32.12
        },
        {
            "StationId": 2,
            "Lat": 31.99,
            "Long": 32.231
        },
        {
            "StationId": 3,
            "Lat": 39.99,
            "Long": 31.231
        },
        {
            "StationId": 4,
            "Lat": 30.99,
            "Long": 39.231
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


//Allotting stations to passengers 
employeeAllotedStation = [];
for (employee in dataSet.Passengers) {
    let smallestDistance = {stationId:"None",distance:dataSet.MaxDistanceFromStation};
    for (stations in dataSet.Stations) {
        let employePoint = new geoPoint(dataSet.Passengers[employee].Lat, dataSet.Passengers[employee].Long);
        let stationPoint = new geoPoint(dataSet.Stations[stations].Lat, dataSet.Stations[stations].Long)
        var distanceFromStation = employePoint.distanceTo(stationPoint, true)
        if(smallestDistance.distance>distanceFromStation){
            smallestDistance.stationId =  dataSet.Stations[stations].StationId;
            smallestDistance.distance = distanceFromStation
        }
    }
    employeeAllotedStation.push({
        passengerId:dataSet.Passengers[employee].PassengerId,
        stationAlloted : smallestDistance.stationId,
        distance : smallestDistance.distance
    })
}
console.log(employeeAllotedStation)

//Finding distances between stations
var vrpSolverOpts = {
    numNodes: 3,
    costs: [[0, 10, 10], [10, 0, 10], [10, 10, 0]],
    durations: [[0, 2, 2], [2, 0, 2], [2, 2, 0]],
    timeWindows: [[0, 9], [2, 3], [2, 3]],
    demands: [[0, 0, 0], [1, 1, 1], [1, 1, 1]]
  };

  var vrpSearchOpts = {
    computeTimeLimit: 1000,
    numVehicles: 3,
    depotNode: 0,
    timeHorizon: 9 * 60 * 60,
    vehicleCapacity: 3,
    routeLocks: [[], [], []],
    pickups: [4, 9],
    deliveries: [12, 8]
  };
  
  var VRP = new node_or_tools.VRP(vrpSolverOpts);
  VRP.Solve(vrpSearchOpts,function(err,success){
      console.log(err,success)
  })