// initialize the angular app for the sermon viewer
var app = angular.module("SermonViewer", []);

app.controller("Sermons", function($scope, $filter, $http, $location) {

	var webRoot = "/";
	var apiRoot = "/php/api/";
	if ($location.host() == "localhost") {
		apiRoot = "/sermonUpload" + apiRoot;
		webRoot = "/sermonUpload" + webRoot;
	}

	$scope.sermons = [];
	
	$scope.downloadSermon = function(sermon) {
		window.location = "/download.php?file=" + sermon.filename;
	}

	$http.get(apiRoot + "sermons.php").success(function(response) {
		$scope.sermons = response;
		for (var key in $scope.sermons) {
			var sermon = $scope.sermons[key];
			if (sermon.start_chap == sermon.end_chap) {
				sermon.text = sermon.book + " " + sermon.start_chap + ":"
				if (sermon.start_verse == sermon.end_verse) {
					sermon.text = sermon.text + sermon.start_verse;
				} else {
					sermon.text = sermon.text + sermon.start_verse + "-" + sermon.end_verse;
				}
			} else {
				sermon.text = sermon.book + " " + sermon.start_chap + ":" + sermon.start_verse + "-" + sermon.end_chap + ":" + sermon.end_verse;
			}
		}
	}).error(function(error) {
		$scope.sermons = error;
	});

});
