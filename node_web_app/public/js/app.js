function onGoogleReady() {
  angular.bootstrap(document.getElementById("map"), ['weatherApp']);
}
var weatherApp = angular.module('weatherApp', ['ui.map']);