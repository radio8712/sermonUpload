<?php
// Import the MySQL library this file uses
require_once("../mysql/Lame.php");

// Create a connection to the database
$myLame = new Lame($localdb);

// Get the data from the POST or GET request
if ($_POST) extract($_POST);
else if ($_GET) extract($_GET);

// Set error flag to false
$error = 0;

// Lame instruction for development use
$lame = "/opt/local/bin/lame --mp3input -a -b 64 ".$upload_dir.$name." ".$upload_dir.$new_name;
// Lame instruction for deployment use
/* $lame = "/src/lame/frontend/lame --mp3input -a -b 64 ".$upload_dir.$name." ".$upload_dir.$new_name; */

// Command to delete the temporary file
$del_file = "rm -f ".$upload_dir.$name;


// Use a regex to parse the percentage of the conversion
$yourParserRegex = "/[0-9]{1,3}%/";
// Initialize the percentage
$percent = 0;

// Convert the file with lame
$handle  = popen($lame . ' 2>&1', 'r');

// Loop over the results to get the percent complete
while (!feof($handle))
{
	$line = stream_get_line($handle, 2048, "[A[A[A");
	preg_match($yourParserRegex, $line, $data);

	$percent = explode("%", $data[0]);
	$percent = $percent[0];
	// Store the percentage in the database
	// This allows the user to get a real time progress bar in the browser
	$myLame->set_percent($id, $percent);
}

if ($percent == 100) {
	// Delete the temporary file if the lame conversion was successful
	exec ($del_file, $output, $return);
	if ($return != 0) {
		// Set the error code to 2 if the file did not delete
		$error = 2;
	}
} else {
	// Set the error code to 1 if the lame conversion did not reach 100%
	$error = 1;
}
// JSON encode the output and echo it to the caller
echo json_encode(array("status" => $error));

?>