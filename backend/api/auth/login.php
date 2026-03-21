<?php

include "../utils/db.php";

header("Content-Type: application/json");

// 🔥 Read JSON input (important fix)
$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $email = $data['email'];
    $password = $data['password'];

    $query = "SELECT * FROM users
              WHERE email='$email'
              AND password='$password'";

    $result = pg_query($conn, $query);

    if (pg_num_rows($result) > 0) {

        $user = pg_fetch_assoc($result);

        echo json_encode([
            "status" => "success",
            "user" => [
    "id" => $user['id'],
    "name" => $user['name'],
    "email" => $user['email']
]
        ]);

    } else {

        echo json_encode([
            "status" => "error",
            "message" => "Invalid login"
        ]);

    }

}
?>