// initialize the angular app for the sermon uploader
var app = angular.module("SermonUploader", ["ui.date","ngSanitize"]);

app.controller("Form", function($scope, $filter, $http, $interval, $location, $timeout) {

//--------------------------------------------------------------------------------
//	Init Variables
//--------------------------------------------------------------------------------
// Temp variabless
	var remoteOnly = true;

// API root is used for all HTTP requests to provide a dynamic context
	var webRoot = "/";
	var apiRoot = "/php/api/";
	if ($location.host() == "localhost") {
		apiRoot = "/sermonUpload" + apiRoot;
		webRoot = "/sermonUpload" + webRoot;
	}

// Init the verse selector
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

// Start the date with today's date
	$scope.date = new Date();
	$scope.textDate = $filter("date")($scope.date, "yyyy-MM-dd");

// Set the options for the date picker
	$scope.dateOptions = {
		changeYear: true,
		changeMonth: true,
		yearRange: '1963:+1'
	};


// Set the services
	$scope.services = [
		{value: "m", option: "Morning"},
		{value: "a", option: "Afternoon"},
		{value: "e", option: "Evening"}
	];


// Set the speaker titles
	$scope.speakerTitles = [{value: "1", option: "Pastor"},{value: "2", option: "Evangelist"},{value: "3", option: "Missionary"}];
	$scope.speakerTitle = $scope.speakerTitles[0].value;

// Declare the other variables used that are initialized to null or empty values
	$scope.speakers = [];
	$scope.speaker;
	$scope.newSpeaker = false;
	$scope.name = "";
	$scope.sermonTitle = "";
	$scope.specialInfo = "";
	$scope.fileName = null;
	$scope.databaseInfo = {};

// Setup the modal status control object
	$scope.modal = {
		visible: false,
		complete: false,
		error: false,
		info: {
			error: false,
			name: false,
			title: false,
			file: false,
			fileSize: false,
		},
		upload: {
			spinner: false,
			success: false,
			error: false,
			text: false,
			progress: false,
			percent: 0,
		},
		convert: {
			spinner: false,
			success: false,
			error: false,
			text: false,
			progress: false,
			percent: 0,
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

// Fill the specified array from the start value to the end value
// This is used in the verse picker to adjust the chapter and verse values
	var arrayFill = function(array, start, end) {
		start = parseInt(start);
		end = parseInt(end);
		if (array.length > 0) {
			if (array[0] < start) {
				for (var i = array[0]; i < start; i = array[0]) {
					array.shift();
				}
			}
			if (array[0] > start) {
				for (var i = array[0] - 1; i >= start; i--) {
					array.unshift(i);
				}
			}
			if (end) {
				if (array[array.length - 1] > end) {
					for (var i = array[array.length - 1]; i > end; i = array[array.length - 1]) {
						array.pop();
					}
				}
				if (array[array.length - 1] < end) {
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

	var setDefaultService = function() {
// Set the service based on the time of day
		var hour = $filter("date")($scope.date, "H");
		if (hour < 12) {
			$scope.service = $scope.services[0];
		} else if (hour < 16) {
			$scope.service = $scope.services[1];
		} else {
			$scope.service = $scope.services[2];
		}
	}
	setDefaultService();

	$scope.goToSermonsPage = function(page) {
		window.location.href = webRoot + "sermons";
	}

	// This function allows the user to reset the form by clicking the button
	// It also gives me a function to call at the end of the chain to reset the form
	$scope.resetForm = function() {
		$scope.date = new Date();
		setDefaultService();
		$scope.speakerTitle = "1";
		$scope.speaker = null;
		$scope.name = "";
		$scope.sermonTitle = "";
		$scope.bible.book = $scope.bible.books[0];
		$scope.bookChange();
		$scope.type = $scope.types[0];
		$scope.specialInfo = "";
		$scope.sermon = null;
		$scope.modal.error = false;
		for (var i in $scope.modal.info) {
			$scope.modal.info[i] = false;
		}
	}

//--------------------------------------------------------------------------------
//	Form submission functions
//--------------------------------------------------------------------------------

//--------------------------------------------------------------------------------
//	The following functions are asynchronous functions that 
//	callback the next step in the sermon submission process.
//	This allows the entire process to remain stay running in
//	order and not complete one step before the previous has completed.
//
//	Each function in this chain is created before it is called to
//		prevent any problems.
//
//	The order is as follows:
//		Upload the audio file
//		Convert the audio file to a web friendly bitrate
//		check for a new speaker to be added to the list
//			add if necessary or move on to the next step
//		Add the sermon to the remote (web facing) database
//		Add the sermon to the local (intranet/private) database
//--------------------------------------------------------------------------------

// Update the local database
	var submitToLocalDatabase = function() {
		$scope.modal.local.text = true;
		$scope.modal.local.spinner = true;


// Set delay to make the site feel more real
// Adding a delay makes the site feel like it is doing something since this operation takes less than 1 second
		$timeout(function() {
			$http({method: "GET", url: apiRoot + "local.php", params: $scope.databaseInfo}).success(function(response) {
				$scope.modal.local.spinner = false;
				if (!response.error && response.result == "00000") {
					$scope.modal.local.success = true;
					$scope.modal.complete = true;
					$scope.resetForm();
				} else {
					$scope.modal.error = true;
					$scope.modal.local.error = true;
					console.log("Result: ", response.result);
					console.log("Error: ", response.error);
				}
			}).error(function(error) {
				$scope.modal.error = true;
				$scope.modal.local.spinner = false;
				$scope.modal.local.error = true;
				console.log("Error: ", error);
			});
		}, 1500);
	}

// Create the object that will be submitted to both databases and
// Update the remote database
	var submitToRemoteDatabase = function() {
		$scope.modal.remote.text = true;
		$scope.modal.remote.spinner = true;

		$scope.databaseInfo = {
			method: "addSermon",
			date: $filter("date")($scope.date, "yyyy-MM-dd"),
			day: $filter("date")($scope.date, "EEE"),
			service: $scope.service.value,
			speaker: $scope.speaker.speaker_id,
			sermon_title: $scope.sermonTitle,
			book: $scope.bible.book.bnum,
			start_chap: $scope.bible.startChap,
			start_verse: $scope.bible.startVerse,
			end_chap: $scope.bible.endChap,
			end_verse: $scope.bible.endVerse,
			sermon_type: $scope.type.type_id,
			special_info: $scope.specialInfo,
			remote_filename: $scope.sermonInfo.new_name,
			local_filename: $scope.sermonInfo.old_name,
		};

// Set delay to make the site feel more real
// Adding a delay makes the site feel like it is doing something since this operation takes less than 1 second
		$timeout(function() {
			$http({method: "GET", url: apiRoot + "remote.php", params: $scope.databaseInfo}).success(function(response) {
				$scope.modal.remote.spinner = false;
				if (!response.error && response.result == "00000") {
					$scope.modal.remote.success = true;
					if (remoteOnly) {
						$scope.modal.complete = true;
						$scope.resetForm();
					} else {
						submitToLocalDatabase();
					}
				} else {
					$scope.modal.error = true;
					$scope.modal.remote.error = true;
					console.log(response);
					console.log("Result: ", response.result);
					console.log("Error: ", response.error);
				}
			}).error(function(error) {
				$scope.modal.error = true;
				$scope.modal.remote.spinner = false;
				$scope.modal.remote.error = true;
				console.log("Error: ", error);
			});
		}, 1500);
	}

// Check to see if the speaker needs to be added to the database
	var checkForNewSpeaker = function() {
		if (!$scope.newSpeaker) {
			// Send the sermon info the remote database
			submitToRemoteDatabase();
		} else {
			$scope.modal.newSpeaker.text = true;
			$scope.modal.newSpeaker.spinner = true;

// Set delay to make the site feel more real
// Adding a delay makes the site feel like it is doing something since this operation takes less than 1 second
			$timeout(function() {
				var speaker = {
					method: "saveNewSpeaker",
					title_id: $scope.speakerTitle,
					name: $scope.name,
				};
				$http({method: "GET", url: apiRoot + "speakers.php", params: speaker}).success(function(response) {
					$scope.modal.newSpeaker.spinner = false;
					if (!response.error && response.speaker_id) {
						$scope.modal.newSpeaker.success = true;
						// Save the id to the speaker and send the sermon info the remote database
						$scope.speaker = {
							speaker_id: response.speaker_id,
						}
						submitToRemoteDatabase();
					} else {
						$scope.modal.error = true;
						$scope.modal.newSpeaker.error = true;
						console.log("Error: ", response.error);
					}
				}).error(function(error) {
					$scope.modal.error = true;
					$scope.modal.newSpeaker.spinner = false;
					$scope.modal.newSpeaker.error = true;
					console.log("Error: ", error);
				});
			}, 1000);
		}
	}




// Prepare the audio for the internet
	var convertAudioFile = function(options, callback) {
		$scope.modal.convert.text = true;
		$scope.modal.convert.spinner = true;
		$scope.modal.convert.progress = true;

		$http({method: "GET", url: apiRoot + "init.php"}).success(function(response) {
			options.id = response.id;



			$scope.modal.convert.timer = $interval(function() {
				$http({method: "GET", url: apiRoot + "percent.php", params: response}).success(function(response) {
					if (response && response.number) {
						$scope.modal.convert.percent = parseInt(response.number);
					}
				}).error(function(error) {
					$scope.modal.error = true;
					$scope.modal.convert.spinner = false;
					$scope.modal.convert.error = true;
					console.log("Error: ", error);
				});
			}, 200);



			$http({method: "GET", url: apiRoot + "lame.php", params: options}).success(function(response) {
				$interval.cancel($scope.modal.convert.timer);
				$scope.modal.convert.spinner = false;
				if (response.status == 0) {
					$scope.modal.convert.percent = 100;
					$scope.modal.convert.success = true;
					checkForNewSpeaker();
				} else {
					$scope.modal.error = true;
					$scope.modal.convert.spinner = false;
					$scope.modal.convert.error = true;
				}
				$http({method: "GET", url: apiRoot + "percent.php", params: {remove_id: options.id}}).success(function(response) {
					console.log("Percent Deleted");
					console.log("Response: ", response);
					console.log("ID: ", options.id);
				}).error(function() {
					console.log("Percent Delete Error");
				});
			}).error(function(error) {
				$interval.cancel($scope.modal.convert.timer);
				$scope.modal.error = true;
				$scope.modal.convert.spinner = false;
				$scope.modal.convert.error = true;
				console.log("Error: ", error);
				$http({method: "GET", url: apiRoot + "percent.php", params: {remove_id: id}});
			});
		}).error(function(error) {
			$scope.modal.error = true;
			$scope.modal.convert.spinner = false;
			$scope.modal.convert.error = true;
			console.log("Error: ", error);
		});
	}




// Submit the form and upload the audio file
	$scope.submitForm = function() {
		$scope.modal.visible = true;

// Make sure there is no missing data
	// Check for a name
		if ($scope.name == "") {
			$scope.modal.info.error = true;
			$scope.modal.info.name = true;
		} else {
	// Check to see if it is a new name or a current speaker
			if (!$scope.speaker || !$scope.speaker.value || $scope.name != $scope.speaker.value) {
				var speaker = $filter("filter")($scope.speakers, {value: $scope.name});
				if (speaker.length == 1) {
					$scope.speaker = $scope.speakers[$scope.speakers.indexOf(speaker[0])];
				} else {
					$scope.newSpeaker = true;
				}
			}
		}
	// Make sure a sermon title exists
		if ($scope.sermonTitle == "") {
			$scope.modal.info.error = true;
			$scope.modal.info.title = true;
		}
	// Set special info to null if it empty
		if ($scope.specialInfo == "") {
			$scope.specialInfo = null;
		}
	// Check for a sermon file
		if ($scope.sermon == undefined) {
			$scope.modal.info.error = true;
			$scope.modal.info.file = true;
		} else if ($scope.modal.info.fileSize) {
	// Make sure the file is not too big
			$scope.modal.info.error = true;
		}
	// Proceed if there are no errors
		if (!$scope.modal.info.error) {
			// Set the new file name for the remote database and converted file
			var tempName = $scope.textDate + "-" + $filter("date")($scope.date, "EEE").toLowerCase() + "-" + $scope.service.value;

			// Store the current name for the local database and the temp name / new name for the uploaded and converted audio files respectively
			$scope.sermonInfo = {
				name: tempName + ".tmp",
				new_name: tempName + ".mp3",
				old_name: $scope.fileName,
			};

	// Submit the form to upload the file
	// The file is the only element that is submitted in the form
	// The rest of the information is sent via ajax
	// The file upload uses jQuery.form.js plugin by M Alsup at http://malsup.com/jquery/form/
	//	to upload the file via ajax in browsers that support it and use another method for browsers that don't
	// Using this plugin enables the file upload progress bar in browsers that support ajax file upload
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
					convertAudioFile($scope.sermonInfo, checkForNewSpeaker);
				},
				error: function(error) {
					console.log(error);
					$scope.modal.error = true;
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
// Bible Verse Picker functions
//--------------------------------------------------------------------------------

// When the book changes
	$scope.bookChange = function() {
		var params = {
			method:	'bookChange',
			book:		$scope.bible.book.bnum,
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

// When the start chapter changes
	$scope.startChapChange = function() {
		var params = {
			method: 			"chapterChange",
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

// When the start verse changes
	$scope.startVerseChange = function() {
		var params = {
			method: 			"verseChange",
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

// When the end chapter changes
	$scope.endChapChange = function() {
		var params = {
			method: 			'chapterChange',
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
			$scope.bible.endVerse = parseInt(response.endVerseNum);
			$scope.bible.text = response.verseText;
		}).error(function(error) {
			console.log("Could not get bible info from database.");
			console.log("Error: ", error);
		});
	}

// When the end verse changes
	$scope.endVerseChange = function() {
		var params = {
			method: 			"verseChange",
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
//	Get initial data from the database
//--------------------------------------------------------------------------------

// Get list of speakers from the database and setup the auto fill
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
		$scope.types = response;
		$scope.type = $scope.types[0];
	}).error(function(error) {
		console.log("Could not get sermon types from database.");
		console.log("Error: ", error);
	});

// Initialize the Bible verse picker
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
//	Watch for changes
//--------------------------------------------------------------------------------

// Watch for the date object to change and set the 
//	date Text to match the date of the date object
	$scope.$watch("date", function(date) {
		$scope.textDate = $filter("date")($scope.date, "yyyy-MM-dd");
	});

// Watch for the modal to close. When it closes reset all the status flags
	$scope.$watch("modal.visible", function(visible) {
		if (visible == false) {
			for (var key in $scope.modal) {
				if ($scope.modal[key] == true) {
					$scope.modal[key] = false;
				} else if ($scope.modal[key] != false) {
					for (var i in $scope.modal[key]) {
						if ($scope.modal[key][i] == true) {
							$scope.modal[key][i] = false;
						}
					}
				}
			}
		}
	});
});