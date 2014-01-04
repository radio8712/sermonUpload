app.controller("Form", function($scope) {
	$scope.yourName = "Thom Williams";

	$scope.percent = 50;
	$scope.status = "TEST";

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