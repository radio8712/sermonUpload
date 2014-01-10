<?php
// Handle file uploads

@$xhr = $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest';

// Extract any upload parameters
if ($_POST) extract($_POST);
else if ($_GET) extract($_GET);

// Initialize the output array
$output = array();

// save any files
foreach($_FILES as $file) {
	$outputDir = "../../uploads/";
	$outputFile = $outputDir.$file["name"];
	move_uploaded_file($file["tmp_name"], $outputDir.$name);
	array_push($output, array("upload_dir" => $outputDir, "name" => $name));
}

// JSON encode the output
$output = json_encode($output);
if (!$xhr) {
// Encase the output in <textarea> tags if the xhr does not exists
// This is necessary for the form submission on older browsers
	echo<<<JSON
<textarea>
$output
</textarea>
JSON;
} else {
	// Send the JSON back to the caller
	echo $output;
}
?>