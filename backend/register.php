<?php

include "db.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    $query = "INSERT INTO users (name, email, password)
              VALUES ('$name', '$email', '$password')";

    $result = pg_query($conn, $query);

    if ($result) {
        echo "Register success";
    } else {
        echo "Register failed";
    }

}

?>