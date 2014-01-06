app.controller("Form", function($scope, $filter, $http) {

//--------------------------------------------------------------------------------
//	Init Variables
//--------------------------------------------------------------------------------
	var apiRoot = "/sermonUpload/php/api/";

	$scope.services = [{value: "m", option: "Morning"},{value: "a", option: "Afternoon"},{value: "e", option: "Evening"}];
	$scope.service = $scope.services[0];

	$scope.speakerTitles = [{value: "1", option: "Pastor"},{value: "2", option: "Evangelist"},{value: "3", option: "Missionary"}];
	$scope.speakerTitle = $scope.speakerTitles[0];

	$scope.speakers = [];
	$scope.speaker = "";

	$scope.dateOptions = {
		changeYear: true,
		changeMonth: true,
		yearRange: '1963:+1'
	};

	$scope.date = new Date();
	$scope.textDate = $filter("date")($scope.date, "yyyy-MM-dd");

	$scope.modal = {
		visible: true,
	};
	$scope.icons = {
		info: {
			error: false,
		},
		error: false,
		upload: {
			spinner: false,
			success: false,
			error: false,
		},
		convert: {
			spinner: false,
			success: false,
			error: false,
		},
		newSpeaker: {
			spinner: false,
			success: false,
			error: false,
		},
		remote: {
			spinner: false,
			success: false,
			error: false,
		},
		local: {
			spinner: false,
			success: false,
			error: false,
		},
	};

//--------------------------------------------------------------------------------
//	Get data from Database
//--------------------------------------------------------------------------------

	$http.get(apiRoot + "speakers.php").success(function(response) {
		$scope.speakers = response;
		console.log(response);
/* 		$(".speaker.autofill").autocomplete(); */
	}).error(function(error) {
		console.log("Could not get speaker list from database.");
		console.log("Error: ", error);
	});

//--------------------------------------------------------------------------------
//	Submit the form
//--------------------------------------------------------------------------------
	$('form').ajaxForm({
		url: "upload.php",
		dataType: "json",
		method: "post",
		beforeSend: function() {
			$scope.status = "";
			$scope.percent = 0;
			$scope.$apply();
		},
		uploadProgress: function(event, position, total, percentComplete) {
			$scope.percent = percentComplete;
			$scope.$apply();
		},
		success: function() {
			$scope.percent = 100;
			$scope.$apply();
		},
		complete: function(xhr) {
			$scope.status = xhr.responseText;
			$scope.$apply();
		}
	});

});