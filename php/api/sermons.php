<?php

require_once("../mysql/Sermon.php");
$myDb = new Sermon($localdb);
$sermons = $myDb->get_sermons();
$output = array();
if (isset($sermons) && !empty($sermons)) {

	foreach($sermons as $sermon) {
		$temp = array();
		foreach($sermon as $key => $value) {
			$temp[$key] = $value;
		}
		array_push($output, $temp);
	}
} else {
	$output["error"] = "Could not get sermons from the database.";
}

echo json_encode($output);
?>