<?php

// Template file for database connections
// This file make prevents the db_conn.php file from
//  being in the GitHub repository
// Rename this file to db_conn.php

// Enter the connection data for your MySQL databases.
// Local Onsite database
$host1 = "";
$user1 = "";
$pass1 = "";
$db1   = "";

// Remote web database
$host2 = "";
$user2 = "";
$pass2 = "";
$db2   = "";

/* Connect to an ODBC database using driver invocation */
$dsn1 = 'mysql:dbname='.$db1.';host='.$host1;
$dsn2 = 'mysql:dbname='.$db2.';host='.$host2;

// Make sure the connections succeeded
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