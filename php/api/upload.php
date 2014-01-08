<?php
@$xhr = $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest';

// return text var_dump for the html request
$output = array();
print_r($_FILES);
foreach($_FILES as $file) {
	echo $file["name"];
	$outputDir = "../../uploads/";
	$outputFile = $outputDir.$file["name"];
	move_uploaded_file($file["tmp_name"], $outputFile);
	array_push($output, $outputFile);
}

$output = json_encode($output);
if (!$xhr) {
	echo "iFrame";
/*
	echo<<<JSON
<textarea>
$output
</textarea>
JSON
*/
} else {
	echo "JSON";
/* 	echo $output; */
}
?>