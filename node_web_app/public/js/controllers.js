var weatherApp = angular.module('weatherApp');

weatherApp.
  controller('TweetFeedCtrl', function TweetFeedCtrl($scope, socket) {
    socket.on('tweet', function(data) {
      $scope.tweet = data.data.text || "No text";
    });
  }).
  controller('MapCtrl', ['$scope', function ($scope) {
    $scope.mapOptions = {
      center: new google.maps.LatLng(35.784, -78.670),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
  }]);