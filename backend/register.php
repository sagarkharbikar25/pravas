<?php

include "db.php";

header("Content-Type: application/json");

$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (!$name || !$email || !$password) {

    echo json_encode([
        "success" => false,
        "message" => "Missing fields"
    ]);

    exit;
}

$query = "INSERT INTO users (name, email, password)
          VALUES ('$name', '$email', '$password')";

$result = pg_query($conn, $query);

if ($result) {

    echo json_encode([
        "success" => true,
        "message" => "Register success"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Database error"
    ]);

}