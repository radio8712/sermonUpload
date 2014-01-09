<?php

require_once("../mysql/Lame.php");

$myLame = new Lame($localdb);

$myId["id"] = $myLame->init();

echo json_encode($myId);

?>