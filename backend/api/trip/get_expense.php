<?php

include "../utils/db.php";

header("Content-Type: application/json");

$trip_id = $_GET['trip_id'];

$query = "SELECT * FROM expenses WHERE trip_id='$trip_id'";
$result = pg_query($conn, $query);

$expenses = array();

if ($result) {

    while ($row = pg_fetch_assoc($result)) {
        $expenses[] = $row;
    }

    echo json_encode([
        "status" => "success",
        "expenses" => $expenses
    ]);

} else {

    echo json_encode([
        "status" => "error",
        "message" => "Failed to fetch expenses"
    ]);
}
?>