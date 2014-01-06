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
		var length = array.length;
		start = parseInt(start);
		end = parseInt(end);
		if (length > 0) {
			if (array[0] < start) {
				for (var i = array[0]; i < start; i = array[0]) {
					array.unshift();
				}
			}
			if (array[0] > start) {
				for (var i = array[0] - 1; i >= start; i--) {
					array.shift(i);
				}
			}
			if (array[length - 1] > end) {
				for (var i = array[length - 1]; i < end; i = array[array.length -1]) {
					array.pop();
				}
			}
			if (array[length - 1] < end) {
				for (var i = array[length - 1] + 1; i <= end; i++) {
					array.push(i);
				}
			}
		} else {
			for (var i = start; i <= end; i++) {
				array.push(i);
			}
		}
	}

	$scope.bookChange = function() {
		
	}

	$scope.startChapChange = function() {
		
	}

	$scope.startVerseChange = function() {
		
	}

	$scope.endChapChange = function() {
		
	}

	$scope.endVerseChange = function() {
		
	}


/******************************
	Verse Picker
******************************/

/********************
	Init
********************/

// Need to convert from exploding with |'s and use a JSON object
/*
	var bible = {};
	getInfo({method: 'init'}, function(response) {
		bible = response;
	});
	if (bible && bible.error) {
		console.log(bible.error);
	}
	// Initialize the variables from the object
	var bookArray = bible.bookList;
	var chapNum = bible.chapNum;
	var verseNum = bible.verseNum;
	var verseText = bible.verseText;

	// Get the select menus
	var book = $("#book");
	var sChap = $("#start_chapter");
	var eChap = $("#end_chapter");
	var sVerse = $("#start_verse");
	var eVerse = $("#end_verse");

	// Empty the select menus
	emptySelect(book);
	emptySelect(sChap);
	emptySelect(eChap);
	emptySelect(sVerse);
	emptySelect(eVerse);	
	for (var key in bookArray)
	{
		setSelect(book, bookArray[key].bnum, bookArray[key].bname);
	}

	addNumbers(sChap, 1, chapNum);
	addNumbers(eChap, 1, chapNum);
	addNumbers(sVerse, 1, verseNum);
	addNumbers(eVerse, 1, verseNum);
	
	eVerse.val(verseNum);
*/

// Initial Verse Load on Page Load // Works
/* 	loadVerses($("#verses"), verseText); */

/********************
	Book Change
********************/

/*
	book.change(function(){
		var info = {};
		getInfo({
			method: 'bookChange',
			book: book.val(),
		},
		function(response) {
			info = response;
		});

		var chapNum = info.chapNum;
		var verseNum = info.verseNum;
		var verseText = info.verseText;

		emptySelect(sChap);
		emptySelect(eChap);
		emptySelect(sVerse);
		emptySelect(eVerse);

		addNumbers(sChap, 1, chapNum);
		addNumbers(eChap, 1, chapNum);
		addNumbers(sVerse, 1, verseNum);
		addNumbers(eVerse, 1, verseNum);
		eVerse.val(verseNum);

// Verse load when Book changes // Works
		loadVerses($("#verses"),verseText);
	});
*/

/********************
	Start Chap Change
********************/

/*
	sChap.change(function(){
		sVerse.val("1");
		var info = {};
		getInfo({
			method: "chapterChange",
			book: book.val(),
			startChapter: sChap.val(),
			startVerse: sVerse.val(),
			endChapter: eChap.val(),
			endVerse: eVerse.val(),
		}, function(response) {
			info = response;
		});

		var sVerseNum = info.startVerseNum;
		var eVerseNum = info.endVerseNum;
		var verseText = info.verseText;
		var sChapVal = parseInt(sChap.val());
		var eChapVal = parseInt(eChap.val());

		if (eChapVal < sChapVal) {
			eChap.val(sChapVal);
			emptySelect(eVerse);
			addNumbers(eVerse, 1, sVerseNum);
			eVerse.val(sVerseNum);
		}
		else if (eChapVal > sChapVal) {
			addNumbers(eChap, sChapVal, $("#end_chapter option:first").val()-1, true);
		}

		delNumbers(eChap, 1, sChapVal-1);

		emptySelect(sVerse);
		addNumbers(sVerse, 1, sVerseNum);

		loadVerses($("#verses"),verseText);
	});
*/

/********************
	End Chap Change
********************/

/*
	eChap.change(function(){
		// parseInt is used to convert string variables to int variables for comparison otherwise each character is compared in place 2 > 10 but 02 < 10
		var sChapVal = parseInt(sChap.val());
		var eChapVal = parseInt(eChap.val());
		// Get the info from the Database
		var info = {};
		getInfo({
			method: 'chapterChange',
			book: book.val(),
			startChapter: sChap.val(),
			startVerse: sVerse.val(),
			endChapter: eChap.val(),
			endVerse: eVerse.val(),
		}, function(response) {
			info = response;
		});
		if (info && info.error) {
			console.log(info.error);
		}

		var sVerseNum = info.startVerseNum;
		var eVerseNum = info.endVerseNum;
		var verseText = info.verseText;

		emptySelect(eVerse);
		
		// If the end chapter is greater than the start chapter allow end verses from 1 to the max in end chapter
		if (eChapVal > sChapVal) {
			addNumbers(eVerse, 1, eVerseNum);
			eVerse.val(eVerseNum);
		}
		// Else if end chapter is = to start chapter make sure end verse is cannot be less than selected start verse
		else if (eChapVal == sChapVal) {
			addNumbers(eVerse, sVerse.val(), eVerseNum);
			eVerse.val(eVerseNum);
		}

		loadVerses($("#verses"),verseText);
	});
*/

/********************
	Start Verse Change
********************/

/*
	sVerse.change(function(){
		var eVerseVal = parseInt(eVerse.val());
		var sVerseVal = parseInt(sVerse.val());
		var eVerseTop = parseInt($("#end_verse option:first").val());
		if (eChap.val() == sChap.val()) {
			if (eVerseVal < sVerseVal) {
				eVerse.val(sVerseVal);
			}
			if (eVerseTop < sVerseVal) {
				delNumbers(eVerse, eVerseTop, sVerseVal-1);
			}
			else if ($("#end_verse option:first").val() > sVerse.val()) {
				addNumbers(eVerse, sVerse.val(), $("#end_verse option:first").val()-1, 1);
			}
		}
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

	$http({method: "GET", url: apiRoot + "bible.php?method=init"}).success(function(response) {
		console.log(response);
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
	}).error(function(error) {
		console.log("Could not get Bible from database.");
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