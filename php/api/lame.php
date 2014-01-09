<?php
require_once("../mysql/Lame.php");



/*
$id = 24;
$name = "2013-11-14.tmp";
$upload_dir = "../../uploads";
$new_name = "11-14-2013AM.mp3";
*/
$myLame = new Lame($localdb);

if ($_POST) extract($_POST);
else if ($_GET) extract($_GET);

$error = 0;	// Set error flag to false
//list($upload_dir, $name) = explode("/", $name);	// Split the upload directory from the current file name
$name = str_replace(" ", "\ ",$name);			// Add slashes to any spaces in the file name

// Lame instruction for development use
$lame = "/opt/local/bin/lame --mp3input -a -b 64 $upload_dir/$name $upload_dir/$new_name";
// Lame instruction for deployment use
//$lame = "/src/lame/frontend/lame --mp3input -a -b 64 $upload_dir/$name $upload_dir/$new_name";

// Delete the temporary file
$del_file = "rm -f $upload_dir/$name";


// Convert the file with lame

$yourParserRegex = "/[0-9]{1,3}%/";
$handle  = popen($lame . ' 2>&1', 'r');

while (!feof($handle))
{
	$line = stream_get_line($handle, 2048, "[A[A[A");
	preg_match($yourParserRegex, $line, $data);
	$data = explode("%", $data[0]);
	$myLame->set_percent($id, $data[0]);
}

$error = 0;
$output = array("status" => $error);
echo json_encode($output);

?>