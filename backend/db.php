<?php

$host = "localhost";
$port = "5432";
$dbname = "pravas";
$user = "postgres";
$password = "112006";

$conn = pg_connect(
    "host=$host port=$port dbname=$dbname user=$user password=$password"
);

if (!$conn) {
    die("Database connection failed");
}

?>