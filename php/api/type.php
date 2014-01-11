<?php

/**************************************************
*	Thom Williams
*	201102W0001
*	CET-482
*	Senior Project - Sermon Uploader
**************************************************/

// Send the sermon types to the caller

require_once "../mysql/Speakers.php";
$speaker = new Speaker($localdb);
$sermonTypes = $speaker->get_sermon_types();
echo json_encode($sermonTypes);
?>