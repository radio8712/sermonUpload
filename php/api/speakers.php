<?php
// Get the files to make a database connection
require_once("../mysql/Speakers.php");

// Make the database connection
$myDb = new Speaker($localdb);

if (!$myDb){
	echo json_encode(array("error" => "Could not open database connection"));
	exit;
}
// Check to see if there is any data being sent
if ($_POST) extract($_POST);
else if ($_GET) extract($_GET);

// Check to see if a new speaker needs saved
if (isset($method) && $method == "saveNewSpeaker") {
	$id = $myDb->add_new_speaker($title_id, $name);
	echo json_encode(array("speaker_id" => $id));
	exit;
} else {
	// Get the list of speakers
	$speakers_r = $myDb->get_speakers();
	
	// error if the connection was unsuccessful
	if (!$speakers_r){
		echo json_encode(array("error" => "Could not get the speaker list"));
		exit;
	}
	
	// Get the list of speakers
	$speakers_n = count($speakers_r);
	$results = array();
	
	// Store the speakers in an array
	for ($i = 0; $i < $speakers_n; $i++) {
		$temp = $speakers_r[$i];
		array_push($results, array("speaker_id"=>$temp["speaker_id"], "title_id"=>$temp["title_id"], "title"=>$temp["title"], "value"=>$temp["speaker"], "label"=>$temp["title"]." ".$temp["speaker"]));
	}
	
	// JSON encode the resulting array and send it to the caller
	echo json_encode($results);
}

?>