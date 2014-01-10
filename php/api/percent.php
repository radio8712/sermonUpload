<?php
require_once("../mysql/Lame.php");

$myLame = new Lame($localdb);

if ($_GET['remove_id']) {
	remove_id($id);
} else {
	$percent = $myLame->get_percent($_GET['id']);
	$percent = json_encode($percent);
	echo $percent;
}
?>