<?php

define("LIMIT", 18);
session_start();


define("DB_HOST", "localhost");
define("DB_NAME", "attendance_taker_db");
define("DB_USER", "root");
define("DB_PASSWORD", "");

$pdo_conn = null;
$dsn = "mysql:host=".DB_HOST.";dbname=".DB_NAME."";
try {
    $pdo_conn = new PDO($dsn, DB_USER, DB_PASSWORD);
    // set the PDO error mode to exception
    $pdo_conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
//    echo "Connected successfully";
} catch (PDOException $e) {
    echo "Connection Failed [details : " . $e->getMessage() ." ]";
}


function closeConnection(PDO $pdo_conn)
{
    $pdo_conn = null;
}