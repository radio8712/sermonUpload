//--------------------------------------------------------------------------------
// Save the file size and name on file selection and hide the file input
//--------------------------------------------------------------------------------
app.directive("tcFile", function() {
	return {
		scope: {
			modal: "=tcFile",
			name: "=fileName",
		},
		link: function(scope, element, attributes) {
			element.on("change", function(event) {
				var files = event.target.files;
				var file = files[0];
				scope.name = file.name;
				var fileSize = file.size;
				if ((fileSize / 1024 / 1024) > 100) {
					scope.modal.info.fileSize = true;
				}
				scope.$apply();
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

//--------------------------------------------------------------------------------
// Initialize the modal and handle opening and closing
//--------------------------------------------------------------------------------
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

//--------------------------------------------------------------------------------
// Progress bar updates
//--------------------------------------------------------------------------------
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
			});
		},
	};
});

//--------------------------------------------------------------------------------
// Use Regular Expressions to filter titles out of the speaker name input
//--------------------------------------------------------------------------------
app.directive("tcTitleFix", function() {
	return {
		scope: {
			title: "=tcTitleFix",
			name: "=ngModel",
		},
		link: function(scope, element, attributes) {
			var matchTitle = function(inputString) {
				var pastor = /\bp[astore]{2,6}\b\ /i;
				var evangelist = /\be[vangelist]{4,10}\b\ /i;
				var missionary = /\bm[isonarye]{2,11}\b\ /i;

				var output;

				if 			(inputString.match(pastor)) 		output = "1";	// If title matches Pastor
				else if (inputString.match(evangelist))	output = "2";	// If title matches Evangelist
				else if (inputString.match(missionary))	output = "3";	// If title matches Missionary
				else output = "0";																		// If title does not match, set default as Pastor

				return output;
			}
			// remove all occurrences of a title and return the input string
			var noTitle = function(inputString) {
				var myRegExp = [/\bm[isonarye]{2,11}\b\ /i,
					/\bp[astore]{2,6}\b\ /i,
					/\be[vangelist]{4,10}\b\ /i,
					/\bb[rothers]{2,7}\b\.?\ /i,
					/\bd[octers]{1,6}\b\.?\ /i
				];
				for (var i in myRegExp) {
					inputString = inputString.replace(myRegExp[i], "");
				}
				return inputString;
			}
			element.on("blur", function() {
				var title = matchTitle(scope.name);
				if (title != "0") {
					scope.title = title;
					scope.name = noTitle(scope.name);
					scope.$apply();
				}
			});
		},
	};
});
