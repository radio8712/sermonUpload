app.controller("Form", function($scope, $filter, $http, $interval) {

//--------------------------------------------------------------------------------
//	Init Variables
//--------------------------------------------------------------------------------
	var apiRoot = "/sermonUpload/php/api/";

	$scope.bible = {
		books: [],
		book: null,
		startChaps: [],
		startChap: null,
		startVerses: [],
		startVerse: null,
		endChaps: [],
		endChap: null,
		endVerses: [],
		endVerse: null,
		text: null,
	};

	$scope.date = new Date();
	$scope.textDate = $filter("date")($scope.date, "yyyy-MM-dd");

	$scope.services = [{value: "m", option: "Morning"},{value: "a", option: "Afternoon"},{value: "e", option: "Evening"}];
	var hour = $filter("date")($scope.date, "H");
	if (hour < 12) {
		$scope.service = $scope.services[0];
	} else if (hour < 16) {
		$scope.service = $scope.services[1];
	} else {
		$scope.service = $scope.services[2];
	}

	$scope.speakerTitles = [{value: "1", option: "Pastor"},{value: "2", option: "Evangelist"},{value: "3", option: "Missionary"}];
	$scope.speakerTitle = $scope.speakerTitles[0].value;

	$scope.speakers = [];
	$scope.speaker;
	$scope.newSpeaker = false;
	$scope.name = "";
	$scope.sermonTitle = "";
	$scope.specialInfo = "";

	$scope.dateOptions = {
		changeYear: true,
		changeMonth: true,
		yearRange: '1963:+1'
	};

	$scope.modal = {
		visible: false,
		info: {
			error: false,
			name: false,
			title: false,
			file: false,
			fileSize: false,
		},
		error: false,
		upload: {
			progress: false,
			percent: 0,
			spinner: false,
			success: false,
			error: false,
			text: false,
		},
		convert: {
			progress: false,
			percent: 0,
			spinner: false,
			success: false,
			error: false,
			text: false,
			timer: null,
		},
		newSpeaker: {
			spinner: false,
			success: false,
			error: false,
			text: false,
		},
		remote: {
			spinner: false,
			success: false,
			error: false,
			text: false,
		},
		local: {
			spinner: false,
			success: false,
			error: false,
			text: false,
		},
	};

//--------------------------------------------------------------------------------
//	Page functions
//--------------------------------------------------------------------------------

	var arrayFill = function(array, start, end) {
		start = parseInt(start);
		end = parseInt(end);
		if (array.length > 0) {
			if (array[0] < start) {
				console.log("1");
				for (var i = array[0]; i < start; i = array[0]) {
					array.shift();
				}
			}
			if (array[0] > start) {
				console.log("2");
				for (var i = array[0] - 1; i >= start; i--) {
					array.unshift(i);
				}
			}
			if (end) {
				if (array[array.length - 1] > end) {
					console.log("3");
					for (var i = array[array.length - 1]; i > end; i = array[array.length - 1]) {
						array.pop();
					}
				}
				if (array[array.length - 1] < end) {
					console.log("4");
					for (var i = array[array.length - 1] + 1; i <= end; i++) {
						array.push(i);
					}
				}
			}
		}
		if (array.length == 0){
			for (var i = start; i <= end; i++) {
				array.push(i);
			}
		}
	}

	var checkForNewSpeaker = function() {
		
	}

	var convertAudioFile = function(options, callback) {
		$scope.modal.convert.text = true;
		$scope.modal.convert.spinner = true;
		$scope.modal.convert.progress = true;

		$http({method: "GET", url: apiRoot + "init.php"}).success(function(response) {
			var id = response.id

			$scope.modal.convert.timer = $interval(function() {
				$http({method: "GET", url: apiRoot + "percent.php", params: response}).success(function(response) {
					$scope.modal.convert.percent = parseInt(response.number);
				}).error(function(error) {
					$scope.modal.convert.spinner = false;
					$scope.modal.convert.error = true;
					console.log("Error: ", error);
				});
			}, 50);

			options.id = id;
			$http({method: "GET", url: apiRoot + "lame.php", params: options}).success(function(response) {
				$interval.cancel($scope.modal.convert.timer);
				$scope.modal.convert.spinner = false;
				if (response.status == 0) {
					$scope.modal.convert.percent = 100;
					$scope.modal.convert.success = true;
					checkForNewSpeaker();
				} else {
					console.log(response.status);
					$scope.modal.convert.spinner = false;
					$scope.modal.convert.error = true;
				}
			}).error(function(error) {
				$interval.cancel($scope.modal.convert.timer);
				$scope.modal.convert.spinner = false;
				$scope.modal.convert.error = true;
				console.log("Error: ", error);
			});
		}).error(function(error) {
			$scope.modal.convert.spinner = false;
			$scope.modal.convert.error = true;
			console.log("Error: ", error);
		});
	}

	$scope.bookChange = function() {
		var params = {
			method: 'bookChange',
			book: $scope.bible.book.bnum,
		}
		$http({method: "get", url: apiRoot + "bible.php", params: params}).success(function(response) {
			arrayFill($scope.bible.startChaps, 1, response.chapNum);
			arrayFill($scope.bible.endChaps, 1, response.chapNum);
			arrayFill($scope.bible.startVerses, 1, response.verseNum);
			arrayFill($scope.bible.endVerses, 1, response.verseNum);
			$scope.bible.startChap = $scope.bible.startChaps[0];
			$scope.bible.endChap = $scope.bible.endChaps[0];
			$scope.bible.startVerse = $scope.bible.startVerses[0];
			$scope.bible.endVerse = $scope.bible.endVerses[$scope.bible.endVerses.length - 1];
			$scope.bible.text = response.verseText;
		}).error(function(error) {
			console.log("Could not get bible info from database.");
			console.log("Error: ", error);
		});
	}

	$scope.startChapChange = function() {
		var params = {
			method: "chapterChange",
			book:					$scope.bible.book.bnum,
			startChapter:	$scope.bible.startChap,
			startVerse:		$scope.bible.startVerse,
			endChapter:		$scope.bible.endChap,
			endVerse:			$scope.bible.endVerse,
		}
		$http({method: "get", url: apiRoot + "bible.php", params: params}).success(function(response) {
			if ($scope.bible.endChap < $scope.bible.startChap) {
				$scope.bible.endChap = $scope.bible.startChap;
				arrayFill($scope.bible.endChaps, $scope.bible.startChap);
				arrayFill($scope.bible.endVerses, 1, response.startVerseNum);
				$scope.bible.endVerse = parseInt(response.startVerseNum);
			} else if ($scope.bible.endChap > $scope.bible.startChap) {
				arrayFill($scope.bible.endChaps, $scope.bible.startChap);
				arrayFill($scope.bible.endVerses, 1);
			}
			arrayFill($scope.bible.startVerses, 1, response.startVerseNum);
			$scope.bible.startVerse = 1;
			$scope.bible.text = response.verseText
		}).error(function(error) {
			console.log("Could not get bible info from database.");
			console.log("Error: ", error);
		});
	}

	$scope.startVerseChange = function() {
		var params = {
			method: "verseChange",
			book:					$scope.bible.book.bnum,
			startChapter:	$scope.bible.startChap,
			startVerse:		$scope.bible.startVerse,
			endChapter:		$scope.bible.endChap,
			endVerse:			$scope.bible.endVerse,
		}
		$http({method: "get", url: apiRoot + "bible.php", params: params}).success(function(response) {
			if ($scope.bible.endChap == $scope.bible.startChap) {
				if ($scope.bible.endVerse < $scope.bible.startVerse) {
					$scope.bible.endVerse = $scope.bible.startVerse;
				}
				arrayFill($scope.bible.endVerses, $scope.bible.startVerse);
			} else {
				if ($scope.bible.endVerses[0] > 1) {
					arrayFill($scope.bible.endVerses, 1);
				}
			}
			$scope.bible.text = response.verseText;
		}).error(function(error) {
			console.log("Could not get bible info from database.");
			console.log("Error: ", error);
		});
	}

	$scope.endChapChange = function() {
		var params = {
			method: 'chapterChange',
			book:					$scope.bible.book.bnum,
			startChapter:	$scope.bible.startChap,
			startVerse:		$scope.bible.startVerse,
			endChapter:		$scope.bible.endChap,
			endVerse:			$scope.bible.endVerse,
		}
		$http({method: "get", url: apiRoot + "bible.php", params: params}).success(function(response) {
			if ($scope.bible.endChap == $scope.bible.startChap) {
				arrayFill($scope.bible.endVerses, $scope.bible.startVerse, response.endVerseNum);
			} else if ($scope.bible.endChap > $scope.bible.startChap) {
				arrayFill($scope.bible.endVerses, 1, response.endVerseNum);
			}
			console.log(response.endVerseNum);
			$scope.bible.endVerse = parseInt(response.endVerseNum);
			$scope.bible.text = response.verseText;
		}).error(function(error) {
			console.log("Could not get bible info from database.");
			console.log("Error: ", error);
		});
	}

	$scope.endVerseChange = function() {
		var params = {
			method: "verseChange",
			book:					$scope.bible.book.bnum,
			startChapter:	$scope.bible.startChap,
			startVerse:		$scope.bible.startVerse,
			endChapter:		$scope.bible.endChap,
			endVerse:			$scope.bible.endVerse,
		}
		$http({method: "get", url: apiRoot + "bible.php", params: params}).success(function(response) {
			$scope.bible.text = response.verseText;
		}).error(function(error) {
			console.log("Could not get bible info from database.");
			console.log("Error: ", error);
		});
	}


//--------------------------------------------------------------------------------
//	Get data from Database
//--------------------------------------------------------------------------------

	// Get list of speakers from the database and setup autocomplete
	$http.get(apiRoot + "speakers.php").success(function(response) {
		$scope.speakers = response;
		$( ".speaker.autofill" ).autocomplete({
			minLength: 0,
			source: $scope.speakers,
			focus: function( event, ui ) {
				$scope.name = ui.item.value;
				return false;
			},
			select: function( event, ui ) {
				$scope.speaker = ui.item;
				$scope.speakerTitle = ui.item.title_id;
				$scope.$apply();
				return false;
			}
		}).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
			return $( "<li>" )
			.append( "<a>" + item.label + "</a>" )
			.appendTo( ul );
		};
	}).error(function(error) {
		console.log("Could not get speaker list from database.");
		console.log("Error: ", error);
	});

	// Get list of sermon types from the database to fill the select menu
	$http.get(apiRoot + "type.php").success(function(response) {
		// Store the response in a scope variable to fill the select menu
		$scope.types = response;
		// Select the first option by default
		$scope.type = $scope.types[0];
	}).error(function(error) {
		console.log("Could not get sermon types from database.");
		console.log("Error: ", error);
	});

	$http({method: "GET", url: apiRoot + "bible.php", params: {method: 'init'}}).success(function(response) {
		$scope.bible.books = response.bookList;
		$scope.bible.book = $scope.bible.books[0];
		arrayFill($scope.bible.startChaps, 1, response.chapNum);
		arrayFill($scope.bible.endChaps, 1, response.chapNum);
		arrayFill($scope.bible.startVerses, 1, response.verseNum);
		arrayFill($scope.bible.endVerses, 1, response.verseNum);
		$scope.bible.startChap = $scope.bible.startChaps[0];
		$scope.bible.endChap = $scope.bible.endChaps[0];
		$scope.bible.startVerse = $scope.bible.startVerses[0];
		$scope.bible.endVerse = $scope.bible.endVerses[$scope.bible.endVerses.length - 1];
		$scope.bible.text = response.verseText;
	}).error(function(error) {
		console.log("Could not get Bible from database.");
		console.log("Error: ", error);
	});

//--------------------------------------------------------------------------------
//	Submit the form
//--------------------------------------------------------------------------------
	$scope.submitForm = function() {
		// Make sure all needed data exists
		$scope.modal.visible = true;
		

/*
		if ($scope.name == "") {
			$scope.modal.info.error = true;
			$scope.modal.info.name = true;
		} else {
			if ($scope.name != $scope.speaker.value) {
				var speaker = $filter("filter")($scope.speakers, {value: $scope.name});
				if (speaker.length == 1) {
					$scope.speaker = $scope.speakers[$scope.speakers.indexOf(speaker[0])];
				} else {
					$scope.newSpeaker = true;
				}
			}
		}
		if ($scope.sermonTitle == "") {
			$scope.modal.info.error = true;
			$scope.modal.info.title = true;
		}
		if ($scope.specialInfo == "") {
			$scope.specialInfo = null;
		}
*/
		if ($scope.sermon == undefined) {
			$scope.modal.info.error = true;
			$scope.modal.info.file = true;
		} else if ($scope.modal.info.fileSize) {
			$scope.modal.info.error = true;
		}
		if (!$scope.modal.info.error) {
			var tempName = $scope.textDate + $filter("date")($scope.date, "EEE").toLowerCase() + $scope.service.value;
			$scope.sermonInfo = {
				name: tempName + ".tmp",
				new_name: tempName + ".mp3",
			};
			$('form').ajaxSubmit({
				url: "php/api/upload.php",
				method: "post",
				data: {name: $scope.sermonInfo.name},
				dataType: "json",
				beforeSend: function() {
					$scope.modal.upload.success = false;
					$scope.modal.upload.error = false;
					$scope.modal.upload.text = true;
					$scope.modal.upload.spinner = true;
					$scope.modal.upload.progress = true;
					$scope.modal.upload.percent = 0;
				},
				uploadProgress: function(event, position, total, percentComplete) {
					$scope.modal.upload.percent = percentComplete;
					$scope.$apply();
				},
				success: function(response) {
					$scope.modal.upload.success = true;
					$scope.modal.upload.percent = 100;
					$scope.$apply();
					$scope.sermonInfo.upload_dir = response[0].upload_dir;
					console.log($scope.sermonInfo);
					convertAudioFile($scope.sermonInfo, checkForNewSpeaker);
				},
				error: function(error) {
					console.log(error);
					$scope.modal.upload.error = true;
					$scope.modal.upload.progess = false;
				},
				complete: function(xhr) {
					$scope.modal.upload.spinner = false;
					$scope.status = xhr.responseText;
					$scope.$apply();
				}
			});
		}
	}

//--------------------------------------------------------------------------------
//	Watch for changes
//--------------------------------------------------------------------------------

	$scope.$watch("date", function(date) {
		$scope.textDate = $filter("date")($scope.date, "yyyy-MM-dd");
	});

});