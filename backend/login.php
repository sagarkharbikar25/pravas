<?php

include "db.php";

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $email = $_POST['email'];
    $password = $_POST['password'];

    $query = "SELECT * FROM users
              WHERE email='$email'
              AND password='$password'";

    $result = pg_query($conn, $query);

    if (pg_num_rows($result) > 0) {

        $user = pg_fetch_assoc($result);

        echo json_encode([
            "success" => true,
            "user_id" => $user['id']
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "Invalid login"
        ]);

    }

}
?>