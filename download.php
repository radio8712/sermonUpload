<?php

// Get the file name from the request
$filename = $_GET['file'];

// Locate the file
$file = "uploads/".$filename;

// Set the header information
header ("Content-type: audio/mp3");
header ("Content-disposition: attachment; filename=".$filename.";");
header("Content-Length: ".filesize($file));

// Stream the file
readfile($file);


?>