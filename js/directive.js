app.directive("tcFile", function() {
	return {
		scope: {
			file: "=tcFile",
		},
		link: function(scope, element, attributes) {
			element.on("click", function() {
				element.prev("input[type='file']").trigger("click");
			});
/*
			scope.$watch("file", function(file){
				console.log("Changed");
			});
*/
		}
	};
});