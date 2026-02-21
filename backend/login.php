<?php

include "db.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $email = $_POST['email'];
    $password = $_POST['password'];

    $query = "SELECT * FROM users
              WHERE email='$email' AND password='$password'";

    $result = pg_query($conn, $query);

    if (pg_num_rows($result) > 0) {
        echo "Login success";
    } else {
        echo "Invalid login";
    }

}

?>