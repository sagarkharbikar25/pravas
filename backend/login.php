<?php

include "db.php";

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $data = json_decode(file_get_contents("php://input"), true);

    $email = $data['email'];
    $password = $data['password'];

    $query = "SELECT id, email FROM users
              WHERE email = $1 AND password = $2";

    $result = pg_query_params($conn, $query, array($email, $password));

    if (pg_num_rows($result) > 0) {

        $user = pg_fetch_assoc($result);

        echo json_encode([
            "success" => true,
            "message" => "Login successful",
            "user" => $user
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "Invalid email or password"
        ]);

    }

}
?>