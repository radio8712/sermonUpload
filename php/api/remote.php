<?php
// Get the files to make a database connection
require_once("../mysql/Sermon.php");

// Make the database connection
$myDb = new Sermon($remotedb);

if (!$myDb){
	echo json_encode(array("error" => "Could not open database connection"));
	exit;
}

// Check to see if there is any data being sent
if ($_POST) extract($_POST);
else if ($_GET) extract($_GET);

// Check to see if a new speaker needs saved
if ($method == "addSermon") {
	$sermon_r = $myDb->add_sermon($date, $service, $speaker, $sermon_title, $book, $start_chap, $start_verse, $end_chap, $end_verse, $sermon_type, $special_info, $filename);

	// error if the save was unsuccessful
	if (!$sermon_r){
		echo json_encode(array("error" => "Could not add the sermon to the database"));
		exit;
	}
	
	// JSON encode the insert ID and send it to the caller
	echo json_encode(array("result" => $sermon_r);
}

?>