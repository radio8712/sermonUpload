<?php
// Retrieve file conversion percentages
// and delete the database entry when complete

require_once("../mysql/Lame.php");

$myLame = new Lame($localdb);

if ($_GET) extract($_GET);

if (isset($remove_id)) {
	remove_id($remove_id);
} else {
	$percent = $myLame->get_percent($id);
	$percent = json_encode($percent);
	echo $percent;
}
?>