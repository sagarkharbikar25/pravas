<?php

include "db.php";

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];

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
            "message" => "Register failed"
        ]);

    }

}
?>