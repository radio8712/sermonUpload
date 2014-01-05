app.controller("Form", function($scope) {

//--------------------------------------------------------------------------------
//	Init Variables
//--------------------------------------------------------------------------------
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

	$scope.services = [{value: "m", option: "Morning"},{value: "a", option: "Afternoon"},{value: "e", option: "Evening"}];
	$scope.service = $scope.services[0];

	$scope.speakerTitles = [{value: "1", option: "Pastor"},{value: "2", option: "Evangelist"},{value: "3", option: "Missionary"}];
	$scope.speakerTitle = $scope.speakerTitles[0];


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