<?php

include "../utils/db.php";

header("Content-Type: application/json");

// 🔥 Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $user_id = $data['user_id'];
    $trip_name = $data['trip_name'];
    $location = $data['location'];
    $start_date = $data['start_date'];
    $end_date = $data['end_date'];

    $query = "INSERT INTO trips (user_id, trip_name, location, start_date, end_date)
              VALUES ('$user_id', '$trip_name', '$location', '$start_date', '$end_date')";

    $result = pg_query($conn, $query);

    if ($result) {
        echo json_encode([
            "status" => "success",
            "message" => "Trip created"
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Trip creation failed"
        ]);
    }
}
?>