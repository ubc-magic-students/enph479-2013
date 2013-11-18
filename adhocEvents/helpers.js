var constants = require("./models/constants.js");

module.exports = function (){

  //Helper functions
  var union = function(arr1, arr2) {
    var union = arr1.concat(arr2);
    for(var i = 0; i < arr1.length; i++) {
      for(var j = arr1.length; j < union.length; j++) {
        if (union[i].id === union[j].id) {
          union.splice(j,1);
        }
      }
    }
    return union;
  }

  var calculateDistance = function(lat1, lon1, lat2, lon2) {
    var R = constants.earthRadius; // km
    return Math.acos(Math.sin(lat1)*Math.sin(lat2) 
        + Math.cos(lat1)*Math.cos(lat2) * Math.cos(lon2-lon1)) * R;
  }

  var findCenter = function(queryResult) {
    var latSum = 0;
    var lonSum = 0;
    var count = 0;
    queryResult.forEach(function(o) {
      latSum += o.coordinates[1];
      lonSum += o.coordinates[0];
      count++;
    });

    return [lonSum/count, latSum/count];
  }

  return {
    union : union,
    findCenter : findCenter,
    calculateDistance : calculateDistance
  }
}();