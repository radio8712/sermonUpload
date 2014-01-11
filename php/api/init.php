<?php

/**************************************************
*	Thom Williams
*	201102W0001
*	CET-482
*	Senior Project - Sermon Uploader
**************************************************/

// Initialize a database entry for the file conversion progressbar

require_once("../mysql/Lame.php");
$myLame = new Lame($localdb);
$myId["id"] = $myLame->init();
echo json_encode($myId);
?>