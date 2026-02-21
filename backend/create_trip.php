<?php

include "db.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $user_id = $_POST['user_id'];
    $trip_name = $_POST['trip_name'];
    $location = $_POST['location'];
    $start_date = $_POST['start_date'];
    $end_date = $_POST['end_date'];

    $query = "INSERT INTO trips (user_id, trip_name, location, start_date, end_date)
              VALUES ('$user_id', '$trip_name', '$location', '$start_date', '$end_date')";

    $result = pg_query($conn, $query);

    if ($result) {
        echo "Trip created";
    } else {
        echo "Trip creation failed";
    }

}

?>