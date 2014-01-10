<?php

// Send the sermon types to the caller

require_once "../mysql/Speakers.php";
$speaker = new Speaker($localdb);
$sermonTypes = $speaker->get_sermon_types();
echo json_encode($sermonTypes);
?>