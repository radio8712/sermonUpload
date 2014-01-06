<?php

// Enter the connection data for your MySQL databases.
// Rename this file to db_conn.php

$host1 = "";
$user1 = "";
$pass1 = "";
$db1   = "";

$host2 = "";
$user2 = "";
$pass2 = "";
$db2   = "";

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