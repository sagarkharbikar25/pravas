<?php

include "../utils/db.php";

header("Content-Type: application/json");

$user_id = $_GET['user_id'];

$query = "SELECT * FROM trips WHERE user_id='$user_id'";
$result = pg_query($conn, $query);

$trips = array();

if ($result) {
    while ($row = pg_fetch_assoc($result)) {
        $trips[] = $row;
    }

    echo json_encode([
        "status" => "success",
        "trips" => $trips
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Failed to fetch trips"
    ]);
}
?>