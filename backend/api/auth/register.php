<?php

include "../utils/db.php";

header("Content-Type: application/json");

// 🔥 Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $name = $data['name'];
    $email = $data['email'];
    $password = $data['password'];

    $query = "INSERT INTO users (name, email, password)
              VALUES ('$name', '$email', '$password')";

    $result = pg_query($conn, $query);

    if ($result) {

        echo json_encode([
            "status" => "success",
            "message" => "Register success"
        ]);

    } else {

        echo json_encode([
            "status" => "error",
            "message" => "Register failed"
        ]);

    }

}
?>