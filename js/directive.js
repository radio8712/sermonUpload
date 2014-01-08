app.directive("tcFile", function() {
	return {
		scope: {
			modal: "=tcFile",
		},
		link: function(scope, element, attributes) {
			element.on("change", function(event) {
				var files = event.target.files;
				var file = files[0];
				var fileSize = file.size;
				if ((fileSize / 1024 / 1024) > 100) {
					scope.modal.info.fileSize = true;
				}
			});
		}
	};
});

app.directive("tcUploadHide", function() {
	return {
		link: function(scope, element, attributes) {
			element.on("click", function() {
				element.prev("input[type='file']").trigger("click");
			});
		}
	};
});

app.directive("tcModal", function() {
	return {
		scope: {
			modal: "=tcModal",
		},
		link: function(scope, element, attributes) {
			element.dialog({
				autoOpen: false,
				modal: true,
				width: 750,
				buttons: [{text: "OK", click: function () {element.dialog("close");}}],
				close: function() {
					scope.modal.visible = false;
					scope.modal.info.error = false;
					scope.modal.info.name = false;
					scope.modal.info.title = false;
					scope.modal.info.file = false;
					scope.modal.info.fileSize = false;
					scope.$apply();
				},
			});
			scope.$watch("modal.visible", function(visible) {
				if (visible) {
					element.dialog("open");
				} else {
					element.dialog("close");
				}
			});
		},
	};
});

app.directive("tcProgressBar", function() {
	return {
		scope: {
			percent: "=tcProgressBar",
		},
		link: function(scope, element, attributes) {
			element.progressbar({
				max: 100,
				value: 0,
			});
			scope.$watch("percent", function(percent) {
				element.progressbar("option", "value", percent);
				console.log(percent);
			});
		},
	};
});
