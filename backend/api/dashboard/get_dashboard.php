<?php

include "db.php";

$user_id = $_GET['user_id'];

$query1 = "SELECT COUNT(*) FROM trips WHERE user_id='$user_id'";
$result1 = pg_query($conn, $query1);
$total_trips = pg_fetch_result($result1, 0, 0);

$query2 = "SELECT SUM(amount)
           FROM expenses
           WHERE trip_id IN (
               SELECT id FROM trips WHERE user_id='$user_id'
           )";

$result2 = pg_query($conn, $query2);
$total_expense = pg_fetch_result($result2, 0, 0);

$data = array(
    "total_trips" => $total_trips,
    "total_expense" => $total_expense
);

echo json_encode($data);

?>