app.directive("tcFile", function() {
	return {
		scope: {
			file: "=tcFile",
		},
		link: function(scope, element, attributes) {
			element.on("click", function() {
				element.prev("input[type='file']").trigger("click");
			});
			scope.$watch("file", function(file){
				console.log(file);
			});
		}
	};
});

app.directive("tcModal", function() {
	return {
		scope: {
			visible: "=tcModal",
		},
		link: function(scope, element, attributes) {
			element.dialog({
				autoOpen: false,
				modal: true,
				width: 750,
				buttons: [{text: "OK", click: function () {element.dialog("close");}}],
				close: function() {
					scope.visible = false;
					scope.$apply();
				},
			});
			scope.$watch("visible", function(visible) {
				if (visible) {
					element.dialog("open");
				} else {
					element.dialog("close");
				}
			});
		},
	};
});
