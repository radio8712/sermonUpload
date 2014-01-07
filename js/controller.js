app.controller("Form", function($scope, $filter, $http) {

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

	$scope.services = [{value: "m", option: "Morning"},{value: "a", option: "Afternoon"},{value: "e", option: "Evening"}];
	$scope.service = $scope.services[0];

	$scope.speakerTitles = [{value: "1", option: "Pastor"},{value: "2", option: "Evangelist"},{value: "3", option: "Missionary"}];
	$scope.speakerTitle = $scope.speakerTitles[0].value;

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


/******************************
	Verse Picker
******************************/

/********************
	End Verse Change
********************/

/*
	eVerse.change(function(){
		var info = {};
		getInfo({
			method: "verseChange",
			book: book.val(),
			startChapter: sChap.val(),
			startVerse: sVerse.val(),
			endChapter: eChap.val(),
			endVerse: eVerse.val(),
		}, function(response) {
			info = response;
		});
		var verseText = info.verseText;
		loadVerses($("#verses"), verseText);
	});
*/



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
				$( ".speaker.autofill" ).val( ui.item.value );
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
/* 		console.log(response); */
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
		$('form').ajaxSubmit({
			url: "php/api/upload.php",
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
	}

});