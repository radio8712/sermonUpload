<?php
@$xhr = $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest';

// return text var_dump for the html request
if ($_POST) extract($_POST);
else if ($_GET) extract($_GET);

$output = array();

foreach($_FILES as $file) {
	$outputDir = "../../uploads/";
	$outputFile = $outputDir.$file["name"];
	move_uploaded_file($file["tmp_name"], $outputDir.$name);
	array_push($output, array("upload_dir" => $outputDir, "name" => $name));
}

$output = json_encode($output);
if (!$xhr) {
	echo<<<JSON
<textarea>
$output
</textarea>
JSON;
} else {
	echo $output;
}
?>