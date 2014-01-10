// initialize the angular app for the sermon viewer
var app = angular.module("SermonViewer", ["ui.date","ngSanitize"]);

app.controller("Sermons", function($scope, $filter, $http, $interval, $location, $timeout) {

	var webRoot = "/";
	var apiRoot = "/php/api/";
	if ($location.host() == "localhost") {
		apiRoot = "/sermonUpload" + apiRoot;
		webRoot = "/sermonUpload" + webRoot;
	}

	$scope.sermons = "Hello";

	$http.get(apiRoot + "sermons.php").success(function(response) {
		$scope.sermons = response;
	}).error(function(error) {
		$scope.sermons = error;
	});

});
