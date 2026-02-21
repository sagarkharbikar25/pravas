<?php

include "db.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $user_id = $_POST['user_id'];
    $latitude = $_POST['latitude'];
    $longitude = $_POST['longitude'];

    $query = "INSERT INTO sos_logs (user_id, latitude, longitude)
              VALUES ('$user_id', '$latitude', '$longitude')";

    $result = pg_query($conn, $query);

    if ($result) {
        echo json_encode(array(
            "status" => "SOS sent",
            "location" => "$latitude,$longitude"
        ));
    } else {
        echo "SOS failed";
    }

}

?>