<?php

// Enter the connection data for your MySQL databases.
// Rename this file to db_conn.php

$host1 = "localhost";
$user1 = "thom";
$pass1 = "lepricon";
$db1   = "sermons";

$host2 = "localhost";
$user2 = "thom";
$pass2 = "lepricon";
$db2   = "sermon2";

/* Connect to an ODBC database using driver invocation */
$dsn1 = 'mysql:dbname='.$db1.';host='.$host1;
$dsn2 = 'mysql:dbname='.$db2.';host='.$host2;
try {
    $localdb = new PDO($dsn1, $user1, $pass1);
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
}

try {
    $remotedb = new PDO($dsn2, $user2, $pass2);
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
}


?>