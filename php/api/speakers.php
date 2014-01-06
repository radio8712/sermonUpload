<?php

require_once("../mysql/Speakers.php");

$myDb = new Speaker($localdb);
$speakers_r = $myDb->get_speakers();

if (!$speakers_r){
	echo "error";
}

$speakers_n = count($speakers_r);
$results = array();


for ($i = 0; $i < $speakers_n; $i++) {
	$temp = $speakers_r[$i];//->fetch_assoc();
/* 	print_r($temp); */
	array_push($results, array("speaker_id"=>$temp["speaker_id"], "title_id"=>$temp["title_id"], "title"=>$temp["title"], "value"=>$temp["speaker"], "label"=>$temp["title"]." ".$temp["speaker"]));
}

echo json_encode($results);
?>