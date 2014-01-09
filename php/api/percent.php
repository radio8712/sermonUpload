<?php
require_once("../mysql/Lame.php");

$myLame = new Lame($localdb);

$percent = $myLame->get_percent($_GET['id']);

$percent = json_encode($percent);
echo $percent;
?>