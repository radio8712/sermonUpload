<?php

/**************************************************
*	Thom Williams
*	201102W0001
*	CET-482
*	Senior Project - Sermon Uploader
**************************************************/

// Retrieve file conversion percentages
// and delete the database entry when complete

require_once("../mysql/Lame.php");

$myLame = new Lame($localdb);

if ($_GET) extract($_GET);

if (isset($remove_id)) {
	$delete = $myLame->remove_id($remove_id);
	echo json_encode(array("status" => $delete));
} else {
	$percent = $myLame->get_percent($id);
	$percent = json_encode($percent);
	echo $percent;
}
?>